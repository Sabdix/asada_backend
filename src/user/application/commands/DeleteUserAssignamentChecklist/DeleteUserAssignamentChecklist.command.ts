export class DeleteUserAssignamentChecklistCommand {
  constructor(
    public readonly uuid: string,
    public readonly uuid_checklist: string
) {}
}
