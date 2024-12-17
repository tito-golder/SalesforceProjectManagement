@isTest
class DevopsDashboardControllerTest {
	@isTest(SeeAllData=true)
	static void testMe() {
		DevopsDashboardController.getPeople();
		DevopsDashboardController.getAllTasks('xxxxx');
	}
}
