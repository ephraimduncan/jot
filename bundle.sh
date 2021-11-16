rm -rf .next/ out/;
rm ./jot-tab-notes.zip;

yarn next build;
yarn next export;

cp ./manifest.json ./out;

cp ./public/extension-icons/icon16.png ./out
cp ./public/extension-icons/icon48.png ./out
cp ./public/extension-icons/icon128.png ./out

rm -rf ./out/extension-icons

node utils/postBuild.js

cd out && zip -r -FS ../jot-tab-notes.zip *;