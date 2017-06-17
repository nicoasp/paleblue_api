describe App {
	beforeEach {
		create user
	}

	- Post to register
	- Post to login

	describe Content {
		
		- Post to content
	}

	describe Like {
		beforeEach {
			login to get token
		}

		- Post to content
	}	
}