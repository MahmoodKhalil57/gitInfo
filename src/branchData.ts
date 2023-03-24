import { execSync } from 'node:child_process';

let getRawBranchData = async(targetRepo:string) => {
  return execSync(`cd ${targetRepo} && git branch -a --format="%(refname:short) %(objectname) %(upstream:short) %(upstream:track) %(HEAD)"`, { encoding: 'utf-8' })
}

let getformattedRawBranchData = async(rawData: string) => {
  let branchData = rawData.split("\n").slice(0, -1)

  type branchDataObjType = {branchName: string, commitHash: string, upstream: string, upstreamTrack: string, head: string}[]
  let branchDataObj: branchDataObjType =  []
  branchData.forEach( (branch) => {
    let branchArr = branch.split(" ")
    let branchName = branchArr[0]
    if(branchName.includes("origin/")){
      let branchObj = {
        branchName : branchName.slice(7),
        commitHash: branchArr[1].slice(0, 7),
        upstream: branchArr[2],
        upstreamTrack: branchArr[3],
        head: branchArr[4]
      }
      branchDataObj.push(branchObj)
    }
  })

  return branchDataObj
}

export let getBranchData = async(targetRepo:string) => {
  let rawBranchData = await getRawBranchData(targetRepo)
  let formattedRawBranchData = await getformattedRawBranchData(rawBranchData)
  return formattedRawBranchData
}