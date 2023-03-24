import { execSync } from 'node:child_process';

let getRawBranchData = async(targetRepo:string) => {
  return execSync(`cd ${targetRepo} && git branch -a --format="%(refname:short) %(objectname) %(upstream:short) %(upstream:track) %(HEAD)"`, { encoding: 'utf-8' })
}

let getformattedRawBranchData = async(rawData: string) => {
  let branchData = rawData.split("\n").slice(0, -1)

  let branchDataObj = branchData.map( branch => {
    let branchArr = branch.split(" ")
    let branchObj = {
      branchName : branchArr[0],
      commitHash: branchArr[1],
      upstream: branchArr[2],
      upstreamTrack: branchArr[3],
      head: branchArr[4]
    }
    return branchObj
    }
  )
  return branchDataObj
}

export let getBranchData = async(targetRepo:string) => {
  let rawBranchData = await getRawBranchData(targetRepo)
  let formattedRawBranchData = await getformattedRawBranchData(rawBranchData)
  return formattedRawBranchData
}