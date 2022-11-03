.PHONY: deploy-functions
deploy-functions:
	firebase deploy --only functions --project=dev

.PHONY: deploy-firestore-rules
deploy-firestore-rules:
	firebase deploy --only firestore:rules --project=dev

.PHONY: deploy-firestore-indexes
deploy-firestore-indexes:
	firebase deploy --only firestore:indexes --project=dev

.PHONY: deploy-storage-rules
deploy-storage-rules:
	firebase deploy --only storage --project=dev

.PHONY: get-firestore-indexes
get-firestore-indexes:
	firebase firestore:indexes > firestore.indexes.json --project=dev
