export class GetAssignedGroupedCheckListQuery {
    constructor(
        public readonly size: number,
        public readonly offset: number,
        public readonly name: string,
        public readonly checkList: string,
        public readonly weekday: string,
        public readonly uuid_branch: string
    ) {}
}