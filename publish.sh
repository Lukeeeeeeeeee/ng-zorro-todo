ng build --prod;
cp ./404.html ./dist/jwt-angular/404.html;
git add dist --force;
git commit -m "demo: build demo";
git subtree push --prefix dist/jwt-angular origin gh-pages;