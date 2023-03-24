

import path from 'path';
import fs from 'fs';
import { getCommitData } from './commitData';
import { getBranchData } from './branchData';

let TARGETREPO = path.resolve("../svelteCurlture")
let OUTPUTDIRECTORY = path.resolve("output")
let OUTPUTFORMATTEDRAWCOMMIT = path.join(OUTPUTDIRECTORY,"formattedRawDataCommit"+".json")
let OUTPUTFORMATTEDRAWBRANCH = path.join(OUTPUTDIRECTORY,"formattedRawDataBranch"+".json")


let saveData = async(commitDataObject: any, formatted: any) => {
  if (!fs.existsSync(OUTPUTDIRECTORY)) {
    fs.mkdirSync(OUTPUTDIRECTORY);
  }

  fs.writeFileSync(OUTPUTFORMATTEDRAWCOMMIT, JSON.stringify(commitDataObject, null, 2))
  fs.writeFileSync(OUTPUTFORMATTEDRAWBRANCH, JSON.stringify(formatted, null, 2))
}

let main = async() => {
  let commitDataObject = await getCommitData(TARGETREPO)

  let branchDataArray = await getBranchData(TARGETREPO)

  await saveData(commitDataObject, branchDataArray)

}

main()