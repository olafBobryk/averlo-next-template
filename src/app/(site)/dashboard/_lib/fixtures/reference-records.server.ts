import "server-only";

export type { ReferenceRecordMutationResult } from "./reference-records.core";
export {
	archiveReferenceRecord,
	createReferenceRecord,
	deleteReferenceRecord,
	getReferenceRecord,
	listReferenceRecords,
	resetReferenceRecordFixtureState,
	updateReferenceRecord,
} from "./reference-records.core";
