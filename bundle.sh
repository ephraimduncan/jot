rm -rf .next/ out/;
rm ./jot-tab-notes.zip;

yarn next build;
yarn next export;

cp ./manifest.json ./out;

node utils/postBuild.js

cd out && zip -r -FS ../jot-tab-notes.zip *;