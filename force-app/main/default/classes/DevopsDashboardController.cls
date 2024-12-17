public without sharing class DevopsDashboardController {
	@AuraEnabled(Cacheable=true)
	public static List<Salesforce_DevOps_Task__c> getAllTasks(String random) {
		return [
			SELECT id, name, assigned_to__c, status__c, importance__c
			FROM Salesforce_DevOps_Task__c
			WHERE status__c != 'Completed'
		];
	}
	@AuraEnabled(Cacheable=true)
	public static List<String> getPeople() {
		List<string> picklistvalues = new List<string>();
		for (
			Schema.PicklistEntry pickListVal : Salesforce_DevOps_Task__c.assigned_to__c.getDescribe()
				.getPicklistValues()
		) {
			picklistvalues.add(pickListVal.getLabel());
		}
		return picklistvalues;
	}
}
