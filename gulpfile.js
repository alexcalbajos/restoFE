var gulp = require('gulp');
var argv = require('yargs').argv;
var fs = require('fs');
var q = require('q');
var request = require('request');
var file = require('gulp-file');
var gutil = require('gulp-util');
var _ = require('lodash');
var swig = require('swig');

var gulp_config = JSON.parse(fs.readFileSync('gulpfile_config.json'));

var environment;

gulp.task('config', function () {
    environment = argv.prod ? 'prod' : 'beta';

    function store_to_tempfile(outfile, obj, parent) {
        var fileName = outfile.substring(0, outfile.indexOf('.'));
        var data = "// tslint:disable" +
            "\n import { InjectionToken } from '@angular/core';" +
            "\n export const STATIC_" + fileName.toUpperCase() + ": any = new InjectionToken('static_" + fileName + "');" +
            "\n export const static_" + fileName + ": any = " + JSON.stringify(obj) + ";";

        return file(outfile, data, { src: true })
            .pipe(gulp.dest(parent));
    };

    store_api_response = function (api_path, outfile, parent, levelToStrip) {
        var def = q.defer();

        var api_basefrag = '';
        var https = require('https');
        var agent = new https.Agent({ keepAlive: true });
        var api_baseurl = ('https://' + gulp_config.domains[environment] + '/' + api_basefrag + 'api/v2/');
        var url = (api_baseurl + api_path);
        request.get({
            url: url,
            strictSSL: false,
            agent: agent,
            headers: {
                'Authorization': ('Basic cmVzdG9pbjozN2Y1MjVlMmI2ZmM=')
            }
        },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var api_data_obj = JSON.parse(body).data;
                    if (levelToStrip) {
                        api_data_obj = api_data_obj[levelToStrip];
                    }
                    var stream = store_to_tempfile(outfile, api_data_obj, parent);
                    stream.on('end', function () {
                        def.resolve(api_data_obj);
                    });
                    return stream;
                } else {
                    console.log(error);
                }

                def.reject('API Fetch Error: ' + url + ' Returned ' + response.statusCode);
            }
        );

        return def.promise;
    };

    var fetch_api_data = function () {
        var promises_ar = [];

        promises_ar.push(store_api_response('config', 'api.ts', 'src/app/_root/static'));
        promises_ar.push(store_api_response('cities', 'cities.ts', 'src/app/_root/static'));

        store_to_tempfile('version.ts', new Date().getTime(), 'src/app/_root/static');

        return q.all(promises_ar);
    };

    return fetch_api_data();
});

gulp.task('robots', function () {
    return gulp.src(gulp_config.robots)
        .pipe(gulp.dest(gulp_config.buildDir));
});

gulp.task('sitemap', async function () {
    environment = argv.prod ? 'prod' : 'beta';

    function string_src(filename, string) {
        var src = require('stream').Readable({ objectMode: true })

        src._read = function () {
            this.push(new gutil.File({ cwd: '', base: '', path: filename, contents: new Buffer.from(string) }));
            this.push(null);
        };

        return src;
    }

    function store_to_tempfile(outfile, obj) {
        return string_src(outfile, obj)
            .pipe(gulp.dest(gulp_config.buildDir));
    };

    function get_api_response(api_path) {
        var def = q.defer();

        var api_basefrag = '';
        var https = require('https');
        var agent = new https.Agent({ keepAlive: true });
        var api_baseurl = ('https://' + gulp_config.domains[environment] + '/' + api_basefrag + 'api/v2/');
        var url = (api_baseurl + api_path);
        request.get({
            url: url,
            strictSSL: false,
            agent: agent,
            headers: {
                'Authorization': ('Basic cmVzdG9pbjozN2Y1MjVlMmI2ZmM=')
            }
        },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    def.resolve(JSON.parse(body).data);
                } else {
                    def.reject('API Fetch Error: ' + url + ' Returned ' + response.statusCode);
                }
            });

        return def.promise;
    };

    function sitemapTask() {
        var deferred = q.defer();
        gutil.log('Generating sitemap for ' + environment + ' environment...');
        get_api_response('cities').then(function (cities) {
            var sitemapByCityPromises = [];
            var categoriesByCountryPromises = [];
            var countries = _getCountriesFromCities(cities);

            countries.forEach(function (country) {
                sitemapByCityPromises.push(get_api_response('sitemap/' + country.countryCode + '.json'));
                categoriesByCountryPromises.push(get_api_response('categories/country/market?countryId=' + country.countryCode));
            });

            q.all([
                q.all(categoriesByCountryPromises),
                q.all(sitemapByCityPromises)
            ]).then(function (responses) {
                _onCitySitemapsReady(responses[1], countries, cities, responses[0], deferred);
            });
        });

        return deferred.promise;
    }

    /**
     * Returns countries of given cities
     * @private
     * @param   {Array} cities Cities
     * @returns {Array} Countries
     */
    function _getCountriesFromCities(cities) {
        var countries = cities.map(function (city) {
            return {
                countryCode: city.country.id,
                tld: city.tld
            }
        });
        countries = _.uniqBy(countries, 'countryCode');
        return countries;
    }

    /**
     * Handler for city sitemaps ready
     * @private
     */
    function _onCitySitemapsReady(JSONsitemaps, countries, cities, categories, deferred) {
        var promises = [];
        JSONsitemaps.forEach(function (JSONsitemap, index) {
            var country = countries[index];
            _mapJSONSitemapWithFullCityInfo(JSONsitemap, cities, country.tld);

            var sitemap = swig.renderFile(gulp_config.siteMapSwig, {
                cities: JSONsitemap,
                categories: categories[index],
                baseUrl: JSONsitemap[0].city.baseUrl,
                now: new Date().toISOString().slice(0, 10),
                miscUrls: _getMiscUrlsFromTld(cities, country.tld)
            });

            promises.push(store_to_tempfile('sitemap-' + country.tld + '.xml', sitemap));
        });
        q.all(promises).then(function () {
            deferred.resolve();
            gutil.log('Sitemaps generated');
        })
    }

    /**
     * Return cities of given tld (Country)
     * @private
     * @param cities
     * @param tld
     * @returns Cities
     */
    function _getCitiesFromTld(cities, tld) {
        return cities.filter(function (city) {
            return city.tld === tld;
        });
    }

    /**
     * Maps JSON sitemap with full city info
     * @private
     * @param   {object} sitemapByCountry
     * @param   {Array}  cities
     * @param   {String} tld
     * @returns {Array}
     */
    function _mapJSONSitemapWithFullCityInfo(sitemapByCountry, cities, tld) {
        var citiesConfig = _getCitiesFromTld(cities, tld);
        sitemapByCountry.map(function (sitemapByCountry) {
            var fullCityInfo = _.find(citiesConfig, function (city) {
                return city.id === sitemapByCountry.city.id;
            });
            _.assign(sitemapByCountry.city, _.pick(fullCityInfo, 'route_absolute', 'route_relative'));
            sitemapByCountry.city.baseUrl = sitemapByCountry.city.route_absolute.replace(sitemapByCountry.city.route_relative, '');
            return sitemapByCountry;
        })
    }

    function _getMiscUrlsFromTld(cities, tld) {
        var lang = _getCitiesFromTld(cities, tld)[0].country.lang;
        var urls = [];
        for (var key in gulp_config.miscUrls) {
            urls.push(gulp_config.miscUrls[key][lang]);
        }
        return urls;
    }

    sitemapTask();
});
