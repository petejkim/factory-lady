- Update `version` in package.json and bower.json
- `npm run build`
- bash: `VERSION=$(cat package.json | jq -r .version)`  
  fish: `set VERSION (cat package.json | jq -r .version)`
- `git commit -m "v$VERSION" -a`
- `git tag "v$VERSION"`
- `npm publish dist/`
- `git push --tags`
