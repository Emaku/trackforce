package com.revature.test.restAssured;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Matchers.contains;
import static org.testng.Assert.assertTrue;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.revature.entity.TfAssociate;
import com.revature.entity.TfBatch;
import com.revature.entity.TfClient;
import com.revature.entity.TfEndClient;
import com.revature.entity.TfMarketingStatus;
import com.revature.entity.TfUser;
import com.revature.services.AssociateService;
import com.revature.services.JWTService;

import io.restassured.response.Response;

/**
 * Rest Assured to ensure that this resource is functioning properly.
 * 
 * @author Jesse
 * @since 06.18.06.16
 */
public class AssociateResourceTest {

	static final String URL = "http://52.87.205.55:8086/TrackForce/associates";
	//static final String URL = "http://localhost:8085/TrackForce/associates";
	
	AssociateService associateService = new AssociateService();
	List<TfAssociate> associates;
	String token;
	TfAssociate associate;
	
	int knownUserId1 = 4500;
	int knownUserId2 = 4501;

	@BeforeClass
	public void beforeClass() {
		token = JWTService.createToken("TestAdmin", 1);
		System.out.println(token);
		associates = new ArrayList<>();
		associates = associateService.getAllAssociates();
		
		TfUser u = new TfUser();
		u.setId(4501);
		
		TfMarketingStatus ms = new TfMarketingStatus();
		ms.setId(4);
		ms.setName("MAPPED: CONFIRMED");

		associate = new TfAssociate();
		associate.setFirstName("Tom");
		associate.setLastName("Jerry");
		associate.setClientStartDate(new Timestamp(150000000L));
		associate.setUser(u);
		associate.setMarketingStatus(ms);
		associate.setEndClient(new TfEndClient());
		associate.setBatch(new TfBatch());
		associate.setId(876);
		associate.setClient(new TfClient());
	}

	/**
	 * Test get all associates to make sure a valid token returns the correct status
	 * code. Ensure the correct content type, check the data from the path matches
	 * what is expected, check that a bad token gives a 401, and that a bad url
	 * gives a 404
	 */
	@Test(priority = 5, enabled = true)
	public void testGetAllAssociates1() {
		Response response = given().header("Authorization", token).when().get(URL + "/allAssociates").then().extract()
				.response();

		assertTrue(response.getStatusCode() == 200);
		assertTrue(response.contentType().equals("application/json"));

		given().header("Authorization", token).when().get(URL + "/allAssociates").then().assertThat().body("id",
				hasSize(associates.size()));
	}

	/**
	 * Unhappy path testing for getAllAssociates
	 */
	@Test(priority = 7, enabled = true)
	public void testGetAllAssociates2() {
		Response response = given().header("Authorization", "Bad Token").when().get(URL + "/allAssociates").then()
				.extract().response();

		assertTrue(response.statusCode() == 401);
		assertTrue(response.asString().contains("Unauthorized"));

		given().header("Authorization", token).when().get(URL + "/notAURL").then().assertThat().statusCode(404);
	}

	/**
	 * Test get an associate to make sure a valid token returns the correct status
	 * code. Ensure the correct content type, check the data from the path matches
	 * what is expected, check that a bad token gives a 401, that a bad url gives a
	 * 404, and a bad userId gives a 204. Check that a field not specified by the
	 * JSON data returns null
	 */
	@Test(priority = 10, enabled = true)
	public void testGetAssociate1() {
		Response response = given().header("Authorization", token).when().get(URL + "/" + knownUserId1).then().extract()
				.response();

		assertTrue(response.getStatusCode() == 200 || response.getStatusCode() == 204);
		if (response.statusCode() == 200) {
			assertTrue(response.contentType().equals("application/json"));
		}

		response = given().header("Authorization", token).when().get(URL + "/" + knownUserId1).then().extract()
				.response();
		
		given().header("Authorization", token).when().get(URL + "/" + knownUserId1).then().assertThat().body("firstName",
				equalTo("Edward"));
				
		assertTrue(response.asString().contains("\"id\":3"));
		assertTrue(response.asString().contains("\"name\":\"MAPPED: SELECTED\""));
	}

	/**
	 * Unhappy path testing for getAssociate
	 */
	@Test(priority = 15)
	public void testGetAssociate2() {
		Response response = given().header("Authorization", "Bad Token").when().get(URL + "/" + knownUserId1).then().extract()
				.response();
		assertTrue(response.statusCode() == 401);
		assertTrue(response.asString().contains("Unauthorized"));

		given().header("Authorization", token).when().get(URL + "/0").then().assertThat().statusCode(204);

		given().header("Authorization", token).when().get(URL + "/badURL").then().assertThat().statusCode(404);

		given().header("Authorization", token).when().get(URL + "/" + knownUserId1).then().assertThat().body("address",
				equalTo(null));
	}

	/**
	 * Happy path testing for updateAssociate. This will check that the resource to
	 * update an associate can be accessed properly, that the resource will update
	 * the associate, and that the updated information is reflected by getting that
	 * particular associate.
	 * 
	 * @author Jesse
	 * @since 06.18.06.16
	 */
	@Test(priority = 40, enabled = true)
	public void testUpdateAssociate1() {
		AssociateService service = new AssociateService();

		Response response = given().header("Authorization", token).contentType("application/json").body(service.getAssociate(associate.getId())).when().get(URL + "/" + knownUserId2).then().extract()
				.response();
		assertTrue(response.statusCode() == 200);
		assertTrue(response.contentType().equals("application/json"));

		assertTrue(response.asString().contains("Tom") && response.asString().contains("Jerry"));
		
		given().header("Authorization", token).when().get(URL + "/" + knownUserId2).then().assertThat().body("marketingStatus.id", equalTo(3));
	}

	/**
	 * Unhappy path testing for updateAssociate. Ensure that a bad verb returns a
	 * 405, a bad URL returns a 404, a nonexistent associate returns 200 (because
	 * its a put request), and that the content type matches what is expected.
	 * 
	 * @author Jesse
	 * @since 06.18.06.16
	 */
	@Test(priority = 45, enabled = true)
	public void testUpdateAssociate2() {
		given().header("Authorization", token).when().post(URL + "/" + knownUserId2).then().assertThat().statusCode(405);

		given().header("Authorization", token).when().get(URL + "/badURL").then().assertThat().statusCode(404);

		given().header("Authorization", token).when().get(URL + "/" + knownUserId2).then().assertThat().body("address",
				equalTo(null));

		Response response = given().header("Authorization", "Bad Token").when().get(URL + "/" + knownUserId2).then().extract()
				.response();

		assertTrue(response.statusCode() == 401);
		assertTrue(response.asString().contains("Unauthorized"));
	}
	
	/**
	 * Test to see if we can change the isApproved by updating the associate
	 */
	@Test(priority = 50, enabled = false)
	public void testUpdateIsApproved() {
		//TfAssociate myAssociate = associateService.getAssociate(associateid)
	}
}
