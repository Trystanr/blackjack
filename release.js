///////////////////////////////////////////////////////////////////////////////
// This file will take the version number and increase it dependant on the
// type of release.
// Minor = [-.-.X] or Feature = [-.X.0] or Major = [X.0.0]
///////////////////////////////////////////////////////////////////////////////

// Get current version number from package.json -------------------------------
const packageJson = require("./package.json")
const releaseJson = require("./public/release/release.json")
const argv = require("minimist")(process.argv.slice(2))
var fs = require("fs")
// Split up current Version Numbers -------------------------------------------
const versionArray = packageJson.version.split(".")
let versionMajor = versionArray[0]
let versionFeature = versionArray[1]
let versionMinor = versionArray[2]

// Increment Version ----------------------------------------------------------
switch (argv.r) {
  case "minor":
    versionMinor++
    break
  case "feature":
    versionFeature++
    versionMinor = 0
    break
  case "major":
    versionMajor++
    versionFeature = 0
    versionMinor = 0
    break
  default:
    break
}

const newVersion = `${versionMajor}.${versionFeature}.${versionMinor}`

// Write Result back to package.json ------------------------------------------
let content = packageJson
content.version = newVersion
content.scripts.release = `git add .; git commit -m '[R] Release: ${newVersion}'; git pull; git push;`
const fileName = "package.json"

fs.writeFile(fileName, JSON.stringify(content, null, 2), function(err) {
  if (err) return console.error(err)
  console.info(
    `Version updated from ${versionArray.join(".")} to ${content.version}`
  )
  console.info("writing to " + fileName)
})

// Write Result back to package.json ------------------------------------------
let contentRelease = releaseJson
contentRelease.versionApp = newVersion
const fileNameRelease = "public/release/release.json"

fs.writeFile(fileNameRelease, JSON.stringify(contentRelease, null, 2), function(
  err
) {
  if (err) return console.error(err)
  console.info(`Release File updated.`)
  console.info("writing to " + fileNameRelease)
})
