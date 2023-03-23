

import { execSync } from 'node:child_process';
import path from 'path';
import fs from 'fs';


let TARGETREPO = path.resolve("../svelteFarmweb")
let OUTPUTFORMATTEDRAW = "formattedRawData"

let getRawCommitData = async() => {
  return execSync(`cd ${TARGETREPO} && git log --all --name-only --date=unix --pretty=format:"!!%n!%n%h%n!%n%an%n!%n%s%n!%n%ad%n!%n%p%n!%n%d%n!"`, { encoding: 'utf-8' })
}

let formatCommit = (commit: string) => {
  let commitArr = commit.split("!").slice(1)
  let files = commitArr[6].split("\n")
  if(files.length) files = files.slice(1, -1)
  files = files.length === 1 ? [] : files.splice(0, files.length - 1)

  let commitObj = {
    commitHash: commitArr[0].replace(/\n/g, ""),
    author: commitArr[1].replace(/\n/g, ""),
    subject: commitArr[2].replace(/\n/g, ""),
    date: commitArr[3].replace(/\n/g, ""),
    parents: commitArr[4].replace(/\n/g, ""),
    branches: commitArr[5].replace(/\n/g, ""),
    files
  }
  return commitObj
}

let getformattedRawCommitData = async(rawData: string) => {
  return rawData.split("!!").slice(1).map( commit => formatCommit(commit))

}

let getRawBranchData = async() => {
  // get all information about all branches
  let rawBranchData = execSync(`cd ${TARGETREPO} && git branch -a --format="%(refname:short) %(objectname) %(upstream:short) %(upstream:track) %(HEAD)"`, { encoding: 'utf-8' })
  let branchData = rawBranchData.split("\n").slice(0, -1)
  let branchDataObj: {
    branchName: string,
    commitHash: string,
    upstream: string,
    upstreamTrack: string,
    head: string
  }[] = []
  branchData.forEach( branch => {
    let branchArr = branch.split(" ")
    let branchObj = {
      branchName : branchArr[0],
      commitHash: branchArr[1],
      upstream: branchArr[2],
      upstreamTrack: branchArr[3],
      head: branchArr[4]
    }
    branchDataObj.push(branchObj)
    }
  )
  return branchDataObj
}

let main = async() => {
  let rawCommitData = await getRawCommitData()
  let formattedRawCommitData = await getformattedRawCommitData(rawCommitData)

  // let rawBranchData = await getRawBranchData()
  // console.log("🚀 ~ file: index.ts:47 ~ main ~ rawBranchData:", rawBranchData)

  fs.writeFileSync(`${OUTPUTFORMATTEDRAW}.json`, JSON.stringify(formattedRawCommitData, null, 2))

}

main()