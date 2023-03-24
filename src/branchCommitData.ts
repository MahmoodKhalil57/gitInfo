import type { getCommitData } from './commitData';
import type { getBranchData } from './branchData';

let getRawBranchCommitsArray = async(commitDataObject: Awaited<ReturnType<typeof getCommitData>>, branchDataArray: Awaited<ReturnType<typeof getBranchData>>) => {
  return branchDataArray.map( branch => {
    let branchObject = {
      branchName: branch.branchName,
      commitHashes: [] as typeof branch.commitHash[]
    }

    
    let nextCommitHash = branch.commitHash
    let nextCommit = !!commitDataObject[nextCommitHash]

    while(nextCommit){
      let commit = commitDataObject[nextCommitHash]
      let originalParentHash = commit.parents[0]

      if(originalParentHash){
        // if not merge commit
        if(commit.parents.length === 1){
          branchObject.commitHashes.push(originalParentHash)
        }
        nextCommitHash = originalParentHash
      } else {
        nextCommit = false
      }
    }


    return branchObject
  })
}

let formatBranchCommitsArray = async(branchCommitsArray: Awaited<ReturnType<typeof getRawBranchCommitsArray>>) => {
  // remove duplicate commit hashes
  let currCommitHashes: string[]
  let uniqueHashes: string[] = []

  let result = branchCommitsArray.map( branch => {
    currCommitHashes = []
    branch.commitHashes.forEach( commitHash => {
      if(!uniqueHashes.includes(commitHash)){
        uniqueHashes.push(commitHash)
        currCommitHashes.push(commitHash)
      }
    })
    branch.commitHashes = currCommitHashes
    return branch
  })

  return result
}

export let getBranchCommitsArray = async(commitDataObject: Awaited<ReturnType<typeof getCommitData>>, branchDataArray: Awaited<ReturnType<typeof getBranchData>>) => {

  let branchCommitsArray = await getRawBranchCommitsArray(commitDataObject, branchDataArray)

  let formattedBranchCommitsArray = await formatBranchCommitsArray(branchCommitsArray)

  return formattedBranchCommitsArray
}