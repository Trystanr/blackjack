const child = require("child_process");
const { format } = require("date-fns");
const fs = require("fs");

//TODO: enter the git url of your project
const gitUrl =
  "https://bitbucket.org/bigbravedigital/wild-bird-revolution-admin-portal/commits/";

const formatCommitMessage = (commitCode, commit) => {
  const msg = commit.message
    .toUpperCase()
    .replace(commitCode, "")
    .toLowerCase();
  let capitalisedMessage = "";
  if (msg.charAt(0) === " ") {
    capitalisedMessage = "- " + msg.charAt(1).toUpperCase() + msg.slice(2);
  } else {
    capitalisedMessage = "- " + msg.charAt(0).toUpperCase() + msg.slice(1);
  }
  return `${capitalisedMessage} ([${commit.sha.substring(0, 6)}](${gitUrl}${
    commit.sha
  }))\n`;
};

const output = child
  .execSync(`git log --format=%B%H--space--%ct----DELIMITER----`)
  .toString("utf-8");

const commitsArray = output
  .split("----DELIMITER----\n")
  .map((commit) => {
    const [message, sha_date] = commit.split("\n");
    const [sha, date] = sha_date ? sha_date.split("--space--") : ["", ""];

    return { sha, message, date };
  })
  .filter((commit) => Boolean(commit.sha));

let release = "pre-release";
const commitsObj = commitsArray.reduce((obj, commit) => {
  if (commit.message.includes("[R]")) {
    release = `${commit.message.replace("[R] Release: ", "")} (${format(
      new Date(parseInt(commit.date) * 1000),
      "d MMM yyyy 'at' HH:mm"
    )})`;
    return obj;
  } else {
    if (commit.message.includes("[F]")) {
      return {
        ...obj,
        [release]: {
          ...(obj[release] || {}),
          features: [
            ...(obj[release]?.features || []),
            formatCommitMessage("[F]", commit),
          ],
        },
      };
    } else if (commit.message.includes("[C]")) {
      return {
        ...obj,
        [release]: {
          ...(obj[release] || {}),
          changes: [
            ...(obj[release]?.changes || []),
            formatCommitMessage("[C]", commit),
          ],
        },
      };
    } else if (commit.message.includes("[B]")) {
      return {
        ...obj,
        [release]: {
          ...(obj[release] || {}),
          bugs: [
            ...(obj[release]?.bugs || []),
            formatCommitMessage("[B]", commit),
          ],
        },
      };
    } else {
      return obj;
    }
  }
}, {});

const commits = Object.entries(commitsObj).reduce(
  (arr, [release, values]) => [...arr, { release, ...values }],
  []
);

let newChangelog = commits.reduce((log, r) => {
  const features =
    r.features?.length > 0
      ? `## Features\n\n ${r.features.reduce(
          (string, c) => `${string} ${c}`,
          ""
        )}\n`
      : "";
  const chores =
    r.changes?.length > 0
      ? `## Changes/ Chores\n\n ${r.changes.reduce(
          (string, c) => `${string} ${c}`,
          ""
        )}\n`
      : "";
  const bugs =
    r.bugs?.length > 0
      ? `## Bugs\n\n ${r.bugs.reduce((string, c) => `${string} ${c}`, "")}\n`
      : "";
  return `${log}\n\n # Version ${r.release}\n\n ${features} ${chores} ${bugs}`;
}, "");

// prepend the newChangelog to the current one
fs.writeFileSync("./CHANGELOG.md", newChangelog);
