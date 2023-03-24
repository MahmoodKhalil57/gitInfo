

import path from 'path';
import fs from 'fs';
import { getCommitData } from './commitData';
import { getBranchData } from './branchData';
import * as dotenv from 'dotenv' 

dotenv.config()
let ENV = process.env
let TARGETREPO = ENV.TARGETREPO ?? "."
let OUTPUTDIRECTORY = ENV.OUTPUTDIRECTORY ?? "output"
let OUTPUTFORMATTEDRAWCOMMIT = ENV.OUTPUTFORMATTEDRAWCOMMIT ?? "formattedRawDataCommit"
let OUTPUTFORMATTEDRAWBRANCH = ENV.OUTPUTFORMATTEDRAWBRANCH ?? "formattedRawDataBranch"


let saveData = async(commitDataObject: any, formatted: any, outputDir:string, outputDirFormattedRawCommit:string, outputDirFormattedRawBranch:string) => {
  let outDir = path.resolve(outputDir)
  let outDirCommit = path.join(outDir, outputDirFormattedRawCommit+".json")
  let outDirBranch = path.join(outDir, outputDirFormattedRawBranch+".json")

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

  fs.writeFileSync(outDirCommit, JSON.stringify(commitDataObject, null, 2))
  fs.writeFileSync(outDirBranch, JSON.stringify(formatted, null, 2))
}

let getSaveData = async(targetRepo:string , outputDir:string, outputDirFormattedRawCommit:string, outputDirFormattedRawBranch:string) => {
  let resolvedTargetRepo = path.resolve(targetRepo)

  let commitDataObject = await getCommitData(resolvedTargetRepo)
  let branchDataArray = await getBranchData(resolvedTargetRepo)

  await saveData(commitDataObject, branchDataArray, outputDir, outputDirFormattedRawCommit, outputDirFormattedRawBranch)
}

let main = async() =>{
    await getSaveData(
      TARGETREPO,
      OUTPUTDIRECTORY,
      OUTPUTFORMATTEDRAWCOMMIT,
      OUTPUTFORMATTEDRAWBRANCH
    )
}

main()