

import path from 'path';
import fs from 'fs';
import { getCommitData } from './commitData';
import { getBranchData } from './branchData';
import { getBranchCommitsArray } from './branchCommitData';
import * as dotenv from 'dotenv' 

dotenv.config()
let ENV = process.env
let TARGETREPO = ENV.TARGETREPO ?? "."
let OUTPUTDIRECTORY = ENV.OUTPUTDIRECTORY ?? "output"
let OUTPUTFORMATTEDRAWCOMMIT = ENV.OUTPUTFORMATTEDRAWCOMMIT ?? "formattedRawDataCommit"
let OUTPUTFORMATTEDRAWBRANCH = ENV.OUTPUTFORMATTEDRAWBRANCH ?? "formattedRawDataBranch"
let OUTPUTFORMATTEDBRANCHCOMMITS = ENV.OUTPUTFORMATTEDBRANCHCOMMITS ?? "formattedBranchCommits"


let saveData = async(commitDataObject: Awaited<ReturnType<typeof getCommitData>>, branchDataArray: Awaited<ReturnType<typeof getBranchData>>, branchCommitsArray: Awaited<ReturnType<typeof getBranchCommitsArray>>, outputDir:string, outputDirFormattedRawCommit:string, outputDirFormattedRawBranch:string, outputDirFormattedBranchCommits:string) => {
  let outDir = path.resolve(outputDir)
  let outDirCommit = path.join(outDir, outputDirFormattedRawCommit+".json")
  let outDirBranch = path.join(outDir, outputDirFormattedRawBranch+".json")
  let outDirBranchCommits = path.join(outDir, outputDirFormattedBranchCommits+".json")

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

  fs.writeFileSync(outDirCommit, JSON.stringify(commitDataObject, null, 2))
  fs.writeFileSync(outDirBranch, JSON.stringify(branchDataArray, null, 2))
  fs.writeFileSync(outDirBranchCommits, JSON.stringify(branchCommitsArray, null, 2))
}

let getSaveData = async(targetRepo:string , outputDir:string, outputDirFormattedRawCommit:string, outputDirFormattedRawBranch:string, outputDirFormattedBranchCommits:string) => {
  let resolvedTargetRepo = path.resolve(targetRepo)

  let commitDataObject = await getCommitData(resolvedTargetRepo)
  let branchDataArray = await getBranchData(resolvedTargetRepo)

  let branchCommitsArray = await getBranchCommitsArray(commitDataObject, branchDataArray)

  await saveData(commitDataObject, branchDataArray, branchCommitsArray, outputDir, outputDirFormattedRawCommit, outputDirFormattedRawBranch, outputDirFormattedBranchCommits)
}

let main = async() =>{
    await getSaveData(
      TARGETREPO,
      OUTPUTDIRECTORY,
      OUTPUTFORMATTEDRAWCOMMIT,
      OUTPUTFORMATTEDRAWBRANCH,
      OUTPUTFORMATTEDBRANCHCOMMITS
    )
}

main()