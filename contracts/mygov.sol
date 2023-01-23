pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";//TODO !!!!!!!!!!!!!!!!!!! change faucet from 5 to 1

contract MyGov is ERC20 { //Inheriting the ERC20 functions for MyGov token
    
	uint MyGovSupply;
    uint currentMyGovSupply; 
	
	constructor(uint tokensupply) ERC20("MyGov", "MG") {
        MyGovSupply = tokensupply; //MyGovSupply will never be altered = constant supply. 
        currentMyGovSupply = tokensupply; 
        _mint(address(this) ,tokensupply); // Actually creating the token supply
	}

	uint donatedWei;    // Total amount of ethers donated by the users.
	uint lockedWei;     // Some of the ethers of the contract are to be reserved for funded projects.
	uint countMembers;  // the code updates this field whenever a change is possible for a user's membership status
    
    uint surveyCreationEtherFee =  40000000000000000; //0.04 ethers in wei
    uint surveyCreationMyGovFee =  2; 
    uint projectCreationEtherFee =  100000000000000000; //0.1 ethers in wei
    uint ProjectCreationMyGovFee = 5; // in MyGov TOKEN 
    
    
        //Each delegation is a struct
		struct VoteDelegation{ 
			uint votedProposalId;
            address delegatingAddress;  //origin of the delegation
		}
			
        struct 	User {
            uint myGovTokens; // weight is accumulated by delegation 
            // even if a member has delegated their vote, these project arrays are so be filled. 
            mapping	(uint =>    uint) votedProjectIdsPayment;  // mapping between project id and the payment the user has voted for
            mapping	(uint =>	bool) votedProjectIdsProposal; //mapping of project ids to the user's state of having already voted
            mapping	(uint =>	bool) takenSurveyIds;
            VoteDelegation[] assumedVoteDelegations ;  //addresses of people of whom member is voting in nomination of. Assumption: If delegated, one cannot drop their MyGov balance to zero
            mapping	(uint => address) transferredVoteDelegations; // addresses of who the user has delegated to, mappedt to projectid
            uint myGovTokensLockedUntil ; // this field needs to be tracked to make sure a user's membership status isn'T dropped during a vote. (mygov balance != 0)
			bool UsedFaucet ; //If the user has already got a token from the faucet it is set to true
            //!!!mapping	(uint =>    uint) voteWeightForProjectId;     
        }

		struct Survey{
            string Ipfshash;    // later to be used in frontend, stores the URL of the project website created by the project owner
            address Owner; 
            uint Deadline; 
            uint AtmostChoice;  //max number of options a member is allowed to choose.
            uint SurveyId;      //starting from 0 for the first survey, increments by one for each new survey
            uint NumChoices;
            uint NumTaken;      //number of times a survey is taken
            uint [] Results;	//results array counts the votes to indexes corresponding to the survey id.
        }
		
		struct ProjectProposal {
			uint [] voteCountForProjectPayment; // array holding vote numbers for each payment
			uint voteCountForProjectProposal;
			uint totalFundingWei;   // Assumption: a project can only be funded with ethers
			uint deadline;
			uint [] paymentAmounts;
			uint [] paySchedule;    // Assumption: IT HOLDS THE PAYMENT (VOTING) DEADLINES FOR EACH INSTALLMENT 
			string ipfsHash;        // later to be used in writing the frontend
			address owner;
			bool [] allowedToWithdraw; //the installments that the owner is allowed to withdraw
            bool isStillFunded; // can be set to 0 if withdrawal
		}
    
    Survey[] public surveys;  // A dynamically-sized array of `Survey` structs, where the index of a survey is it's id
    ProjectProposal[] public projectProposals;  // A dynamically-sized array of `Proposal` structs, where the index of a proposal is it's id
    mapping(address => User) public users;      // from user address to user itself This declares a state variable that stores a User struct for each possible address.
    

    function isMember(address useraddress) public view returns(bool){
        return balanceOf(useraddress)>0;
    }//

    function submitSurvey(string memory ipfshash,uint surveydeadline,uint numchoices, uint atmostchoice) public payable returns (uint surveyid) {
        
		require(isMember(msg.sender), "1"); // Only members can submit a survey
        require(balanceOf(msg.sender) >= surveyCreationMyGovFee, "1"); // 
		require(balanceOf(msg.sender) > surveyCreationMyGovFee  || users[msg.sender].myGovTokensLockedUntil <= block.timestamp, "3"); 
        require(msg.value >= surveyCreationEtherFee, "Not enough ethers to submit the survey.");

		uint[] memory results = new uint[](numchoices) ; 

        surveyid = surveys.length; // surveyid is the idx of the survey in the surveys array

		//only after all the exceptions are cleared, the survey submission starts
		Survey memory mysurvey = Survey({
                    Ipfshash : ipfshash,
                    Owner: msg.sender,
                    Deadline: surveydeadline,
            		SurveyId: surveyid,
                    AtmostChoice: atmostchoice,
                    NumChoices: numchoices,
                    NumTaken : 0,
                    Results : results // a zeros array
        });
        

        transfer(address(this), surveyCreationMyGovFee); //2 MyGov tokens from the survey submitter(msg.sender) sent to the smart contract.
        donatedWei += surveyCreationEtherFee; 
        
        if(!isMember(msg.sender)){
            countMembers--;
        }

        //adding the survey to surveys array
        surveys.push(mysurvey);
		mysurvey.SurveyId = surveyid;

        
        // paying their change back (msg.value - surveyCreationEtherFee)
        (bool sent , bytes memory data) = msg.sender.call{value: msg.value - surveyCreationEtherFee}(""); 
        require(sent, "failed to refund");
        
        return (surveyid);
	}//     

    function takeSurvey(uint surveyid,uint [] memory choices) public {
        User storage survee = users[msg.sender];
        require(isMember(msg.sender),"Non members cannot participate in the survey.");
        require(survee.takenSurveyIds[surveyid] == false, "You already participated in the survey");
        require (surveys[surveyid].Deadline >= block.timestamp, "Deadline exceeded."); // checking if the deadline is here yet.
        
        //start taking the survey
        for(uint i=0; i < choices.length; i++){
            surveys[surveyid].Results[choices[i]] ++ ; // adding the member's choices to the results
        } 

        surveys[surveyid].NumTaken += 1; 
        survee.takenSurveyIds[surveyid] = true;
    }//

	function getSurveyResults(uint surveyid) public view returns(uint numtaken, uint [] memory results) {
		numtaken = surveys[surveyid].NumTaken;
		results  = surveys[surveyid].Results;
		return (numtaken, results);
	}//

	function getSurveyInfo(uint surveyid) public view returns(string memory ipfshash,uint surveydeadline,uint numchoices, uint atmostchoice) {
		ipfshash = surveys[surveyid].Ipfshash;
		surveydeadline = surveys[surveyid].Deadline;
		numchoices = surveys[surveyid].NumChoices;
		atmostchoice = surveys[surveyid].AtmostChoice;
		return( ipfshash, surveydeadline, numchoices, atmostchoice);
	}//

	function getSurveyOwner(uint surveyid) public view returns(address surveyowner){
		return (surveys[surveyid].Owner);
	}//

	function getNoOfSurveys() public view returns(uint numsurveys){
		return (surveys.length);
	}//

	function faucet() public {

        address spender = msg.sender;
		require ( (currentMyGovSupply) > 0,"No more tokens left in the contract.");
		require(users[spender].UsedFaucet == false, "You already used the faucet.");
    
        this.transfer(spender, 1); //  transfering 1 mygov token from the contract to the user calling the function (aka msg.sender) //TODO CHANGE IT BACK TO 1,AFTER TESTING SUBMISION
        users[spender].UsedFaucet = true; //this is crucial, otherwise a malicious user could drain the contract
        users[spender].myGovTokens += 1;  //todo dont need it anymore

        countMembers++;
        
	}//  
		
    function reserveProjectGrant(uint projectid) public{

		require(getIsProjectFunded(projectid),"Project not funded.");
		require( 
            (projectProposals.length > projectid) && (projectid >= 0) ,
            "No such project exists with given id.");
		require (msg.sender == projectProposals[projectid].owner);
		require(findSchIndex(projectid) == 0, "The deadline has passed."); //??????????? or the one below?
		require (projectProposals[projectid].deadline >= block.timestamp, "Deadline exceeded."); // checking if the deadline is here yet.
        
		uint totalfunding = 0;
		
		for(uint i=0;i < projectProposals[projectid].paymentAmounts.length;i++){
			totalfunding += projectProposals[projectid].paymentAmounts[i];
		}
		require(address(this).balance >= totalfunding, "Not enough ethers to fund the project.");
		lockedWei += totalfunding;
        //projectProposals[projectid].allowedToWithdraw[0] = true;//first payment is approved by default, but a vote will be necessary for next payments
		//delete approve(projectProposals[projectid].owner, projectProposals[projectid].paymentAmounts[0]); ??? msg.sender is calling this function. the approval wont go through?
    } 
    function withdrawProjectPayment(uint projectid) public {
        int indx = int(findSchIndex(projectid))-1;// index of last payment to be withdrawn
		require(indx != -1, "The voting for the installment still ongoing");
        require( (projectProposals.length > projectid) && (projectid >= 0) , "No such project exists with given id.");
		require (msg.sender == projectProposals[projectid].owner,"You are not the owner"); // CRUCIAL: checking if the person trying to withdraw is actually the owner of the project
		require(findSchIndex(projectid) < projectProposals[projectid].paySchedule.length,"The index is not in the boundaries of the payschedule array"); //checking if the index in the boundaries of the payschedule array (more installlments than specified were attempted)
        uint idx = findSchIndex(projectid) -1;
        require(projectProposals[projectid].paySchedule[idx]<= block.timestamp,"The timestamp is not after the corresponding date in the schedule"); //ASSUMPTION : Can receive the payment only after the corresponding date in the schedule 
     

		uint tobelocked = 0 ;
		ProjectProposal memory  p= projectProposals[projectid]; 
		
		for(uint i=0;i <= idx; i++){ //When the user calls the withdraw function they will withdraw all awaiting approved payments, but not the next payment (whose idx found by findschindex) 
			if(p.allowedToWithdraw[i]){
				tobelocked += p.paymentAmounts[i];
                projectProposals[projectid].allowedToWithdraw[i]=false;
			}
		}
		
		lockedWei -= tobelocked;
		donatedWei -= tobelocked;

        (bool sent , bytes memory data) = msg.sender.call{value: tobelocked}(""); //sending the funds to the project owner
        require(sent, "failed to refund");
    } //      

    function votingforinstallment(uint projectid, bool choice) public{
        uint indx = findSchIndex(projectid)+1; // index of  payment to be voted
		require( (projectProposals.length > projectid) && (projectid >= 0) ,"No such project exists with given id.");
		//if the vote was delegated for the project proposal, it remains delegated for all the payments.
        User storage voter = users[msg.sender];
        require(isMember(msg.sender), "User is not a member thus cannot vote.");
        require(voter.votedProjectIdsPayment[projectid] != indx ,"User has already voted for this payment.");
        require(voter.transferredVoteDelegations[projectid] == address(0),"User has delegated someone else to vote for the project.");
        require(indx-1 <  projectProposals[projectid].paySchedule.length, "vote deadlines has passed.");
       
        uint idx = findSchIndex(projectid); // index of  payment to be voted

        /*if(choice){
            projectProposals[projectid].voteCountForProjectPayment[idx] += users[msg.sender].voteWeightForProjectId[projectid]+1;
        }*/
        if (choice){
			projectProposals[projectid].voteCountForProjectPayment[idx] += 1 ;
		}
    
        uint yess = projectProposals[projectid].voteCountForProjectPayment[idx];
		
        if(countMembers <= 100*(yess)){
            projectProposals[projectid].isStillFunded = true;
             projectProposals[projectid].allowedToWithdraw[idx] = true;
             //this.increaseAllowance(projectProposals[projectid].owner, projectProposals[projectid].paymentAmounts[idx]);
             //approve(projectProposals[projectid].owner, projectProposals[projectid].paymentAmounts[idx]);
		}
		else{
            projectProposals[projectid].isStillFunded = false;
		}

        voter.votedProjectIdsPayment[projectid] = indx; //this mapping hold the idx+1 since its default is 0, it would cause issues to set it to idx .
		//else{boolarray[projectProposals[projectid].current_payment_month-1] = false;
		
	} //TODO DEADLINE CHECK
		
	// return which index we are currently at in our paysch array
    function findSchIndex(uint projectid) public view returns (uint idx){//ASSUMPTION a month is always 30 days 
        //uint[] memory payschedule = projectProposals[projectid].paySchedule;
        for(uint i = 0; i < projectProposals[projectid].paySchedule.length; i++){ //returns the first payment whose payment date is not here yet
            if(block.timestamp < projectProposals[projectid].paySchedule[i]){
                return i;
            }
        }

        return  projectProposals[projectid].paySchedule.length; //a nonexistent index to indicate that all payments are made
    }//

    function getIsProjectFunded(uint projectid) public view returns(bool funded){ //todo is project still funded or was ever funded???
		require(  (projectProposals.length > projectid) && (projectid >= 0) ,"No such project exists with given id.");	

		if(projectProposals[projectid].isStillFunded){
			return true;}
		else{
			return false;}
    }//
    

    function getProjectNextPayment(uint projectid) public view returns(uint next){ //ASSUMPTION THAT IT RETURNS THE this months PAYMENT AMOUNT, but it can be only withdrawn at the end of the month, so it is technically the next payment
        uint idx = findSchIndex(projectid);
		return projectProposals[projectid].paymentAmounts[idx];//ASSUMPTION: returns current payment amount since we assume the payment can be withdrawn at the end of the month
    } // returns this current payment, that is about to be made

    function getProjectOwner(uint projectid) public view returns(address projectowner){
		return projectProposals[projectid].owner;
    }//

    function getProjectInfo(uint projectid) public view returns(string memory ipfshash, uint votedeadline,uint [] memory paymentamounts, uint [] memory payschedule){
		ipfshash = projectProposals[projectid].ipfsHash;
		votedeadline = projectProposals[projectid].deadline;
		paymentamounts = projectProposals[projectid].paymentAmounts;
		payschedule = projectProposals[projectid].paySchedule;
		return (ipfshash,votedeadline,paymentamounts,payschedule);
    }//

    function delegateVoteTo(address memberaddr, uint projectid) public payable{
       
        //check if the delegating person has right to vote ASSUMPTION self delegation is disabled
        address to = memberaddr;
        address from = msg.sender; //if the caller of function isn't a member the method will be reverted
        require(isMember(to),"Delegation can only be done to members.");
        require(isMember(from),"Non-members don't have the right to vote thus no right to delegate.");
        require(from != to,"Self-delegation is not possible.");
        require(users[from].transferredVoteDelegations[projectid] == address(0),"The delegation has already happened.");
        require(users[to].transferredVoteDelegations[projectid] == address(0),"The person to be delagated has already delegated their vote to someone else");
        require(users[to].votedProjectIdsProposal[projectid]==false,"Delegation to a member who has already voted is not possible") ; 

        users[to].assumedVoteDelegations.push(VoteDelegation({
                votedProposalId: projectid,
                delegatingAddress: from
            }));

        users[from].transferredVoteDelegations[projectid] = to;
       
       
       /* //check if the delegating person has right to vote ASSUMPTION self delegation is disabled
   
        users[to].assumedVoteDelegations.push(VoteDelegation({
                votedProposalId: projectid,
                delegatingAddress: from
            }));

        users[from].transferredVoteDelegations[projectid] = to;
        
        User storage voter = users[to];

        for(uint i = 0; i < users[to].assumedVoteDelegations.length; i++){
            VoteDelegation memory voteDelegation = voter.assumedVoteDelegations[i];
            if((voteDelegation.votedProposalId == projectid)){  // todo , change storage
                    users[to].voteWeightForProjectId[projectid] += users[users[msg.sender].assumedVoteDelegations[i].delegatingAddress].voteWeightForProjectId[projectid] +1;
                    users[users[msg.sender].assumedVoteDelegations[i].delegatingAddress].voteWeightForProjectId[projectid] = 0;
            }
        }*/
        
    }// WHAT IF... the respresentative also delegated his vote?????? todo!!!!!!!!!!!!!
 
    function donateEther() public payable{
        donatedWei += msg.value ; //payable donate function receiving the ether amount to be donated directly from msg.value
    }//

    receive() external payable{ 
        donatedWei += msg.value ;
    }//


    function donateMyGovToken(uint amount) public {
        require(
            balanceOf(msg.sender) >= amount,
            "Insufficient MyGovTokens balance for entered donation amount."
        );

        require(
            ( balanceOf(msg.sender) > amount || (users[msg.sender].myGovTokensLockedUntil <= block.timestamp)),
            "User cannot drop it's member status during voting."
        );

        transfer(address(this), amount); // transfering the donation from user's (msg.sender's) account
        users[msg.sender].myGovTokens -=amount; // todo delete all mygovtokens fields?
        if(!isMember(msg.sender)){
            countMembers--;
        }
  
    } 


    //when a voter is voting, it also uses the votes it has been delegated at exactly that moment
    //Assumption: a project name cant be zero (or whatever the default value is)

    function voteForProjectProposal(uint projectid,bool choice) public { 
     
        require( 
            (projectProposals.length > projectid) && (projectid >= 0) ,
            "No such project exists with given id.");

        User storage voter = users[msg.sender]; // todo change to users[]???
        require(voter.votedProjectIdsProposal[projectid] != true,"User has already voted");
        require(voter.transferredVoteDelegations[projectid] == address(0),"User has delegated someone else to vote for the project.");
        require(isMember(msg.sender), "User is not a member thus cannot vote.");
        
         //first vote for own
        voter.votedProjectIdsProposal[projectid] = true;
        if(choice){
            projectProposals[projectid].voteCountForProjectProposal++;
        }
        if(voter.myGovTokensLockedUntil < projectProposals[projectid].deadline){
            voter.myGovTokensLockedUntil = projectProposals[projectid].deadline;
        }

        //then vote for the delegators TODO ERROR, did not increase vote numbers 
        for(uint i = 0; i < voter.assumedVoteDelegations.length; i++){
            VoteDelegation memory voteDelegation = voter.assumedVoteDelegations[i];
            if((voteDelegation.votedProposalId == projectid)){  // todo , change storage
                User storage delegated = users[voteDelegation.delegatingAddress];
                if(!delegated.votedProjectIdsProposal[projectid]){
                    delegated.votedProjectIdsProposal[projectid] = true;
                    if(delegated.myGovTokensLockedUntil < projectProposals[projectid].deadline){
                        delegated.myGovTokensLockedUntil = projectProposals[projectid].deadline;
                    }
                    if(choice){
                        projectProposals[projectid].voteCountForProjectProposal++;
                    }
                }
            }
        }
        /*
        //first vote for own
        users[msg.sender].votedProjectIdsProposal[projectid] = true;
        
        
        if(users[msg.sender].myGovTokensLockedUntil < projectProposals[projectid].deadline){
            users[msg.sender].myGovTokensLockedUntil = projectProposals[projectid].deadline;
        }

        for(uint i = 0; i < voter.assumedVoteDelegations.length; i++){
            VoteDelegation memory voteDelegation = voter.assumedVoteDelegations[i];
            
            if((voteDelegation.votedProposalId == projectid)){  // todo , change storage
                //User storage delegated = users[voteDelegation.delegatingAddress];
                if(!users[voteDelegation.delegatingAddress].votedProjectIdsProposal[projectid]){
                    users[voteDelegation.delegatingAddress].votedProjectIdsProposal[projectid] = true;
                    if( users[voteDelegation.delegatingAddress].myGovTokensLockedUntil < projectProposals[projectid].deadline){
                        users[voteDelegation.delegatingAddress].myGovTokensLockedUntil = projectProposals[projectid].deadline;
                    }
                }
            }
        }

        if(choice){
            projectProposals[projectid].voteCountForProjectProposal += users[msg.sender].voteWeightForProjectId[projectid]+1;
        }*/

        if(countMembers <= 10*(projectProposals[projectid].voteCountForProjectProposal)){
            projectProposals[projectid].isStillFunded = true;
		}
		else{
            projectProposals[projectid].isStillFunded = false;
		}
    } //TODO DEADLINE CHECK
    
    function submitProjectProposal(string memory ipfshash, uint votedeadline, uint [] memory paymentamounts, uint [] memory payschedule) public payable returns (uint projectid) {
        require(isMember(msg.sender), "Non-members cannot call this function.");
		require(balanceOf(msg.sender) >= ProjectCreationMyGovFee, "1"); 
		require(balanceOf(msg.sender) > ProjectCreationMyGovFee  || users[msg.sender].myGovTokensLockedUntil <= block.timestamp, "3"); //since user cannot drop their membership status
        require(msg.value >= projectCreationEtherFee, "Not enough ethers to submit the survey.");
		
        uint[] memory votecountsforpayment = new uint[](paymentamounts.length); 

			
        transfer(address(this),ProjectCreationMyGovFee);
        donatedWei += ProjectCreationMyGovFee;

        projectid = projectProposals.length;
            
        ProjectProposal memory p = ProjectProposal({
            voteCountForProjectPayment: votecountsforpayment,
            voteCountForProjectProposal: 0,
            totalFundingWei: 0,
            deadline: votedeadline,
            paymentAmounts: paymentamounts,
            paySchedule: payschedule,
            ipfsHash: ipfshash,
            owner: msg.sender,
			allowedToWithdraw: new bool[](paymentamounts.length), 
            isStillFunded : false
        });

        //adding the survey to proposals array
        projectProposals.push(p); //project submitted by adding the projectproposal instance to the array	

        // paying their change back (msg.value - surveyCreationEtherFee)
        (bool sent , bytes memory data) = msg.sender.call{value: msg.value - projectCreationEtherFee}(""); 
        require(sent, "failed to refund");

        if(!isMember(msg.sender)){
            countMembers --;
        }

        return projectid;
    }   

    function getNoOfProjectProposals() public view returns(uint numproposals){
        return projectProposals.length;
    }//

    function getNoOfFundedProjects () public view returns(uint numfunded){
        uint count = 0;
        for(uint i = 0; i < projectProposals.length; i++){
            if(getIsProjectFunded(i)){
                count++;
            }
        }
        return count;
    }//

    function getEtherReceivedByProject (uint projectid) public view returns(uint amount){
        require( 
            (projectProposals.length > projectid) && (projectid >= 0) ,
            "No such project exists with given id.");

        return projectProposals[projectid].totalFundingWei;
         
    }//

    function mint(address to,uint amount) public { // defined here again in order to speed up testing.
        _mint(to, amount);
    }//

  
}
