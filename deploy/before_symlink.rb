deploy_env = new_resource.environment["DEPLOY_ENV"]

run "cd #{release_path} && npm cache clear --force"
run "cd #{release_path} && npm install"
run "cd #{release_path} && mkdir dist && chmod 777 dist"

if deploy_env == 'prod'
    run "cd #{release_path} && gulp config --prod"
    run "cd #{release_path} && ng lint"
    run "cd #{release_path} && ng build --prod"
    run "cd #{release_path} && gulp robots --prod"
    run "cd #{release_path} && gulp sitemap --prod"
else
    run "cd #{release_path} && gulp config"
    run "cd #{release_path} && ng lint"
    run "cd #{release_path} && ng build --prod --configuration=beta"
    run "cd #{release_path} && gulp robots"
    run "cd #{release_path} && gulp sitemap"
end

run "cd #{release_path} && cp src/.htaccess dist/.htaccess"



