export type rawCommitDataType = {
  commitHash?: string;
  author: string;
  subject: string;
  date: string;
  parents: string;
  branches: string;
  files: string[];
}[]