<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

    <url>
        <loc>{{baseUrl | lower}}</loc>
        <lastmod>{{now}}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>

    {% for miscUrl in miscUrls %}
        <url>
            <loc>{{baseUrl + miscUrl | lower}}</loc>
            <changefreq>monthly</changefreq>
            <lastmod>{{now}}</lastmod>
            <priority>0.2</priority>
        </url>
    {% endfor %}

    {% for city in cities %}
        <url>
            <loc>{{city.city.route_absolute | lower}}</loc>
            <changefreq>daily</changefreq>
            <lastmod>{{now}}</lastmod>
            <priority>0.8</priority>
        </url>
        {% for category in categories[city.city.id] %}
            <url>
                <loc>{{city.city.route_absolute + '/' + loop.key | lower}}</loc>
                <changefreq>weekly</changefreq>
                <lastmod>{{now}}</lastmod>
                <priority>0.4</priority>
            </url>
            {% for subcategory in category %}
                <url>
                    <loc>{{city.city.route_absolute + '/' + subcategory | lower}}</loc>
                    <changefreq>weekly</changefreq>
                    <lastmod>{{now}}</lastmod>
                    <priority>0.4</priority>
                </url>
            {% endfor %}
        {% endfor %}
            {% for provider in city.providers %}
                <url>
                    <loc>{{baseUrl + provider.provider_url | lower}}</loc>
                    <changefreq>weekly</changefreq>
                    <lastmod>{{now}}</lastmod>
                    <priority>0.6</priority>
                </url>
            {% endfor %}
    {% endfor %}

</urlset>
