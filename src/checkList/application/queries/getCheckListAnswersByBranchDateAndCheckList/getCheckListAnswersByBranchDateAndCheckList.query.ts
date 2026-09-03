export class GetCheckListAnswersByBranchDateAndCheckListQuery {
  constructor(
    public readonly uuidBranch: string,
    public readonly date: string,
    public readonly uuidCheckList: string,
  ) {}
}
