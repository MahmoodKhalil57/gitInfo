import type { getCommitData } from './commitData';
import type { getBranchData } from './branchData';

let getRawBranchCommitsArray = async(commitDataObject: Awaited<ReturnType<typeof getCommitData>>, branchDataArray: Awaited<ReturnType<typeof getBranchData>>, removeMergedTop: boolean) => {
  let parentIndex = removeMergedTop ? 0 : 1


  return branchDataArray.map( branch => {
    let branchObject = {
      branchName: branch.branchName,
      commitHashes: [] as typeof branch.commitHash[]
    }

    
    let nextCommitHash = branch?.commitHash

    while(nextCommitHash){
      let commit = commitDataObject[nextCommitHash]

      if(!removeMergedTop || commit.parents.length === 1){
        branchObject.commitHashes.push(nextCommitHash)
      }
      
      nextCommitHash = commit.parents[parentIndex] ?? commit.parents[0]
    }


    return branchObject
  })
}

let formatBranchCommitsArray = async(branchCommitsArray: Awaited<ReturnType<typeof getRawBranchCommitsArray>>, removeMergedBottom: boolean) => {
  // remove duplicate commit hashes
  let currCommitHashes: string[]
  let uniqueHashes: string[] = []

  let result = removeMergedBottom ?  branchCommitsArray.map( branch => {
    currCommitHashes = []
    branch.commitHashes.forEach( commitHash => {
      if(!uniqueHashes.includes(commitHash)){
        uniqueHashes.push(commitHash)
        currCommitHashes.push(commitHash)
      }
    })
    branch.commitHashes = currCommitHashes
    return branch
  }):
  branchCommitsArray

  return result
}

export let getBranchCommitsArray = async(commitDataObject: Awaited<ReturnType<typeof getCommitData>>, branchDataArray: Awaited<ReturnType<typeof getBranchData>>, removeUnique: boolean) => {

  let branchCommitsArray = await getRawBranchCommitsArray(commitDataObject, branchDataArray, removeUnique)

  let formattedBranchCommitsArray = await formatBranchCommitsArray(branchCommitsArray, removeUnique)

  return branchCommitsArray
}