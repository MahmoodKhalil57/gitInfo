import { execSync } from 'node:child_process';

let getRawCommitData = async(targetRepo: string) => {
  return execSync(`cd ${targetRepo} && git log --all --name-only --date=unix --pretty=format:"!!%n!%n%h%n!%n%an%n!%n%s%n!%n%ad%n!%n%p%n!%n%d%n!"`, { encoding: 'utf-8' })
}

let formatCommit = (commit: string) => {
  let commitArr = commit.split("!").slice(1)
  let parents = commitArr[4].replace(/\n/g, "").split(" ")

  let files = commitArr[6].split("\n")
  files = files.slice(1, -1)
  files = files.length === 1 ? [] : files.splice(0, files.length - 1)

  let commitObj = {
    commitHash: commitArr[0].replace(/\n/g, ""),
    author: commitArr[1].replace(/\n/g, ""),
    subject: commitArr[2].replace(/\n/g, ""),
    date: commitArr[3].replace(/\n/g, ""),
    branches: commitArr[5].replace(/\n/g, ""),
    parents,
    files
  }
  return commitObj
}

let getformattedRawCommitData = async(rawData: string) => {
  return rawData.split("!!").slice(1).map( commit => formatCommit(commit))
}
type getformattedRawCommitDataReturnType = Awaited<ReturnType<typeof getformattedRawCommitData>>

let getIdexCommitDataByHash = async(formattedRawCommitData: getformattedRawCommitDataReturnType) => {
  type commitDataObjectType = {[key: string] : Omit<typeof formattedRawCommitData[number], "commitHash">}
  
  const commitDataObject: commitDataObjectType = {}
  formattedRawCommitData.forEach( commit => {
    let {commitHash, ...truncatedCommit} = commit
    commitDataObject[commitHash] = truncatedCommit
  })
  return commitDataObject
}

export let getCommitData = async(targetRepo: string) => {
  let rawCommitData = await getRawCommitData(targetRepo)
  let formattedRawCommitData = await getformattedRawCommitData(rawCommitData)
  let commitDataObject = await getIdexCommitDataByHash(formattedRawCommitData)
  return commitDataObject
}