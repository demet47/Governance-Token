import Head from "next/head";
import { useState, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import { ethers } from "ethers";
import moment from "moment";
import { Router } from "next/router";
import { useRouter } from "next/router";

export default function Home() {
  const { account, balance, contract, connectWallet } = useWallet();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  // PARAMETERS FUNCTIONS
  const [ipfshash, setIpfshash] = useState("");
  const [surveydeadline, setSurveydeadline] = useState("");
  const [numchoices, setNumchoices] = useState("");
  const [atmostchoice, setAtmostchoice] = useState("");
  const [surveyid, setSurveyid] = useState("");
  const [choices, setChoices] = useState("");
  const [projectid, setProjectid] = useState("");
  const [choice, setChoice] = useState("");
  const [memberaddr, setMemberaddr] = useState("");
  const [amount, setAmount] = useState("");
  const [votedeadline, setVotedeadline] = useState("");
  const [paymentamounts, setPaymentamounts] = useState("");
  const [payschedule, setPayschedule] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [owner, setOwner] = useState("");
  const [spender, setSpender] = useState("");
  const [account_, setAccount] = useState("");
  const [useraddress, setUseraddress] = useState("");
  const [balanceOf, setBalanceOf] = useState("");
  const [link, setLink] = useState("");
  const [show_mint, set_show_mint] = useState(false);

  // --------------------------------
  // STATE_LIST OF RETURN VALUES
  const [isMember, set_isMember] = useState(null);
  const [submitSurvey, set_submitSurvey] = useState(null);
  const [takeSurvey, set_takeSurvey] = useState(null);
  const [getSurveyResults, set_getSurveyResults] = useState(null);
  const [getSurveyInfo, set_getSurveyInfo] = useState(null);
  const [getSurveyOwner, set_getSurveyOwner] = useState(null);
  const [getNoOfSurveys, set_getNoOfSurveys] = useState(null);
  const [faucet, set_faucet] = useState(null);
  const [reserveProjectGrant, set_reserveProjectGrant] = useState(null);
  const [withdrawProjectPayment, set_withdrawProjectPayment] = useState(null);
  const [votingforinstallment, set_votingforinstallment] = useState(null);
  const [findSchIndex, set_findSchIndex] = useState(null);
  const [getIsProjectFunded, set_getIsProjectFunded] = useState(null);
  const [getProjectNextPayment, set_getProjectNextPayment] = useState(null);
  const [getProjectOwner, set_getProjectOwner] = useState(null);
  const [getProjectInfo, set_getProjectInfo] = useState(null);
  const [delegateVoteTo, set_delegateVoteTo] = useState(null);
  const [donateEther, set_donateEther] = useState(null);
  const [donateMyGovToken, set_donateMyGovToken] = useState(null);
  const [voteForProjectProposal, set_voteForProjectProposal] = useState(null);
  const [submitProjectProposal, set_submitProjectProposal] = useState(null);
  const [getNoOfProjectProposals, set_getNoOfProjectProposals] = useState(null);
  const [getNoOfFundedProjects, set_getNoOfFundedProjects] = useState(null);
  const [getEtherReceivedByProject, set_getEtherReceivedByProject] =
    useState(null);
  const [transferToken, set_transferToken] = useState(null);
  const [transferTokensFrom, set_transferTokensFrom] = useState(null);
  useState(null);
  const [allowanceToken, set_allowanceToken] = useState(null);
  const [approveToken, set_approveToken] = useState(null);
  const [totalTokenSupply, set_totalTokenSupply] = useState(null);
  const [tokenBalanceOf, set_tokenBalanceOf] = useState(null);
  const [mint, set_mint] = useState(null);

  // HANDLE_LIST OF BUTTONS=> These functions are called when the buttons are clicked.
  const getUser = async (e) => {
    e.preventDefault();
    console.log(account);
    if (!userId) {
      alert("Please input userId");
      return;
    }

    contract
      .balanceOf(userId)
      .then((resp) => {
        if (resp._hex === "0x00") {
          setBalanceOf("0x00");
        } else {
          setBalanceOf(resp._hex);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    //resp.myGovTokens._hex +
    contract
      .users(userId)
      .then((resp) => {
        setUsers(
          "MyGovTokens : " +
            balanceOf +
            ", myGovTokensLockedUntil :" +
            resp.myGovTokensLockedUntil._hex +
            ", usedFaucet :" +
            resp.UsedFaucet
        );
        console.log(resp);
      })
      .catch((error) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        setUsers(result[0]);
      });
  };
  const _txHistory = async (e) => {
    e.preventDefault();
    // route https://blockexplorer.bloxberg.org/address/0x1275D096B9DBf2347bD2a131Fb6BDaB0B4882487/transactions

    const url = "http://bounance.online:8000/entries";

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  };
  function txHistory() {
    const url = "http://bounance.online:8000/entries";

    const response = fetch(url).then((response) =>
      console.log(response.json())
    );

    router.push(
      "https://blockexplorer.bloxberg.org/address/0x1275D096B9DBf2347bD2a131Fb6BDaB0B4882487/transactions"
    );
  }

  const handle_balanceOf = async () => {
    contract
      .balanceOf(useraddress)
      .then((resp) => setBalanceOf(resp._hex))
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        setBalanceOf(result[0]);
      });
  };
  const handle_isMember = () => {
    contract
      .isMember(useraddress)
      .then((resp) => {
        if (resp) {
          set_isMember("Yes");
        }
        if (!resp) {
          set_isMember("No");
        }
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);
        set_isMember(result[0]);
      });
  };
  const handle_submitSurvey = async () => {
    const options = {
      value: ethers.utils.parseUnits("0.4", 18),
      from: account,
      gasLimit: 3000000,
    };

    contract
      .submitSurvey(ipfshash, surveydeadline, numchoices, atmostchoice, options)
      .then((resp1) => {
        console.log(resp1);
        contract.getNoOfSurveys().then((resp) => {
          const number = resp._hex;
          if (number === null) {
            set_getNoOfSurveys(0x00);
          } else {
            set_getNoOfSurveys(resp._hex);
          }

          const submit = fetch(
            "http://bounance.online:8000/entry?user=" +
              userId +
              "&tx=" +
              resp1.hash
          );
          set_submitSurvey("id :" + getNoOfSurveys + " , Hash:" + resp1.hash);
          console.log(resp);
        });
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(e.message);

        set_submitSurvey(result[0]);
      });
  };
  const handle_takeSurvey = () => {
    //Object.entries(choices) converts the object to an array.
    const arr = choices.split(",");
    const options = {
      from: account,
      gasLimit: 3000000,
    };
    contract
      .takeSurvey(surveyid, arr, options)
      .then((resp) => set_takeSurvey(resp))
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_takeSurvey(result[0]);
      });
  };
  const handle_getSurveyResults = () => {
    contract
      .getSurveyResults(surveyid)
      .then((resp) => {
        set_getSurveyResults(
          "numtaken : " +
            resp.numtaken._hex +
            " ,  results : " +
            resp.results +
            ""
        );
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_getSurveyResults(result[0]);
      });
  };
  const handle_getSurveyInfo = () => {
    contract
      .getSurveyInfo(surveyid)
      .then((resp) => {
        setLink(resp.ipfshash);
        console.log(resp);
        set_getSurveyInfo(
          "ipfshash : " +
            resp.ipfshash +
            " ,  surveydeadline : " +
            moment(resp.surveydeadline._hex * 1000).format(
              "YYYY-MM-DD hh:mm:ss"
            ) +
            ", numchoices : " +
            resp.numchoices._hex +
            ", atmostchoice : " +
            resp.atmostchoice._hex
        );
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_getSurveyInfo(result[0]);
      });
  };
  const handle_getSurveyOwner = () => {
    contract
      .getSurveyOwner(surveyid)
      .then((resp) => set_getSurveyOwner(resp))
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        set_getSurveyOwner(result[0]);
      });
  };
  const handle_getNoOfSurveys = () => {
    contract
      .getNoOfSurveys()
      .then((resp) => {
        set_getNoOfSurveys(resp._hex);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_getNoOfSurveys(result[0]);
      });
  };
  const handle_faucet = () => {
    contract
      .faucet({ gasLimit: 3000000 })
      .then((resp) => {
        set_faucet("Success");
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_faucet(result[0]);
      });
  };
  const handle_reserveProjectGrant = () => {
    const options = {
      from: account,
      gasLimit: 3000000,
    };
    contract
      .reserveProjectGrant(projectid, options)
      .then((resp) => {
        set_reserveProjectGrant("Success");
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_reserveProjectGrant(result[0]);
      });
  };
  const handle_withdrawProjectPayment = () => {
    const options = {
      from: account,
      gasLimit: 3000000,
    };
    contract
      .withdrawProjectPayment(projectid, options)
      .then((resp) => {
        set_withdrawProjectPayment("Success");
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_withdrawProjectPayment(result[0]);
      });
  };
  const handle_votingforinstallment = () => {
    const options = {
      from: account,
      gasLimit: 3000000,
    };
    contract
      .votingforinstallment(projectid, choice, options)
      .then((resp) => {
        set_votingforinstallment("Success");
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_votingforinstallment(result[0]);
      });
  };
  const handle_findSchIndex = () => {
    const options = {
      from: account,
      gasLimit: 3000000,
    };
    contract
      .findSchIndex(projectid, options)
      .then((resp) => {
        set_findSchIndex(resp._hex);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_findSchIndex(result[0]);
      });
  };
  const handle_getIsProjectFunded = () => {
    contract
      .getIsProjectFunded(projectid)
      .then((resp) => {
        if (resp === true) {
          set_getIsProjectFunded("True");
        }
        if (resp === false) {
          set_getIsProjectFunded("False");
        }
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_getIsProjectFunded(result[0]);
      });
  };
  const handle_getProjectNextPayment = () => {
    contract
      .getProjectNextPayment(projectid)
      .then((resp) => {
        set_getProjectNextPayment(resp);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_getProjectNextPayment(result[0]);
      });
  };
  const handle_getProjectOwner = () => {
    contract
      .getProjectOwner(projectid)
      .then((resp) => {
        set_getProjectOwner(resp);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_getProjectOwner(result[0]);
      });
  };
  const handle_getProjectInfo = () => {
    contract
      .getProjectInfo(projectid)
      .then((resp) => {
        setLink(resp.ipfshash);
        set_getProjectInfo(
          "ipfshash : " +
            resp.ipfshash +
            " , votedeadline " +
            moment(resp.votedeadline._hex * 1000).format(
              "YYYY-MM-DD hh:mm:ss"
            ) +
            ", paymentamounts : " +
            resp.paymentamounts +
            " , payschedule: " +
            resp.payschedule
        );
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_getProjectInfo(result[0]);
      });
  };
  const handle_delegateVoteTo = () => {
    const options = {
      from: account,
      gasLimit: 3000000,
    };
    contract
      .delegateVoteTo(memberaddr, projectid, options)
      .then((resp) => {
        set_delegateVoteTo(resp);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_delegateVoteTo(result[0]);
      });
  };
  const handle_donateEther = () => {
    var Web3 = require("web3");
    const options = {
      value: Web3.utils.toWei(amount, "wei"),
      //value: ethers.utils.parseUnits(amount, 18) * 1000000000000000000,
      from: account,
      gasLimit: 3000000,
    };
    contract
      .donateEther(options)
      .then((resp) => {
        set_donateEther("Success  Hash:" + resp.hash);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_donateEther(result[0]);
      });
  };
  const handle_donateMyGovToken = () => {
    const options = {
      from: account,
      gasLimit: 3000000,
    };
    contract
      .donateMyGovToken(amount, options)
      .then((resp) => {
        set_donateMyGovToken("Success  Hash:" + resp.hash);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_donateMyGovToken(result[0]);
      });
  };
  const handle_voteForProjectProposal = () => {
    const options = {
      from: account,
      gasLimit: 3000000,
    };
    contract
      .voteForProjectProposal(projectid, choice, options)
      .then((resp) => {
        set_voteForProjectProposal("Success  Hash:" + resp.hash);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_voteForProjectProposal(result[0]);
      });
  };
  const handle_submitProjectProposal = () => {
    const options = {
      value: ethers.utils.parseUnits("0.1", 18),
      from: account,
      gasLimit: 3000000,
    };
    const ar_payment = paymentamounts.split(",");
    console.log(ar_payment);
    contract
      .submitProjectProposal(
        ipfshash,
        votedeadline,
        ar_payment,
        payschedule,
        options
      )
      .then((resp1) => {
        contract.getNoOfProjectProposals().then((resp) => {
          const number = resp._hex;
          console.log(number);
          if (number === null || number === undefined) {
            set_submitProjectProposal("id :0x00 , Hash:" + resp1.hash);
            set_getNoOfProjectProposals(0x00);
          } else {
            set_getNoOfProjectProposals(number);
            set_submitProjectProposal(
              "id :" + number + " , Hash:" + resp1.hash
            );
          }

          console.log(resp);
          const submit = fetch(
            "http://bounance.online:8000/entry?user=" +
              account +
              "&tx=" +
              resp1.hash,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
        });
      })
      .catch((e) => {
        console.log(e);
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }

        set_submitProjectProposal(result[0]);
      });
  };
  const handle_getNoOfProjectProposals = () => {
    contract
      .getNoOfProjectProposals()
      .then((resp) => {
        set_getNoOfProjectProposals(resp._hex);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_getNoOfProjectProposals(result[0]);
      });
  };
  const handle_getNoOfFundedProjects = () => {
    contract
      .getNoOfFundedProjects()
      .then((resp) => {
        set_getNoOfFundedProjects(resp._hex);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_getNoOfFundedProjects(result[0]);
      });
  };
  const handle_getEtherReceivedByProject = () => {
    contract
      .getEtherReceivedByProject(projectid)
      .then((resp) => {
        set_getEtherReceivedByProject(resp._hex);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_getEtherReceivedByProject(result[0]);
      });
  };
  const handle_transferToken = () => {
    contract
      .transferToken(to, amount)
      .then((resp) => {
        set_transferToken(resp);
        console.log(resp);
      })
      .catch((e) => {
        set_transferToken(e.message);
      });
  };
  const handle_transferTokensFrom = () => {
    contract
      .transferTokensFrom(from, to, amount)
      .then((resp) => {
        set_transferTokensFrom(resp);
        console.log(resp);
      })
      .catch((e) => {
        set_transferTokensFrom(e.message);
      });
  };
  const handle_allowanceToken = () => {
    contract
      .allowanceToken(owner, spender)
      .then((resp) => {
        set_allowanceToken(resp);
        console.log(resp);
      })
      .catch((e) => {
        set_allowanceToken(e.message);
      });
  };
  const handle_approveToken = () => {
    contract.approveToken(spender, amount).then((resp) => {
      set_approveToken(resp);
      console.log(resp);
    });
  };
  const handle_totalTokenSupply = () => {
    contract.totalTokenSupply().then((resp) => {
      set_totalTokenSupply(resp);
      console.log(resp);
    });
  };
  const handle_tokenBalanceOf = () => {
    contract.tokenBalanceOf(account_).then((resp) => {
      set_tokenBalanceOf(resp);
      console.log(resp);
    });
  };
  const handle_mint = () => {
    contract
      .mint(to, amount)
      .then((resp) => {
        set_mint(resp);
        console.log(resp);
      })
      .catch((e) => {
        var regex = /(?:"data":{"message":).*/g;
        var str = e.message;
        var result = regex.exec(str);
        if (result === null) {
          result = ["Error"];
        }
        console.log(result[0]);

        set_mint(result[0]);
      });
  };

  // HANDLE_LIST OF INPUTS
  const handleChangeInput = (e) => {
    setUserId(e.target.value);
  };
  const handle_pm_ipfshash = (e) => {
    setIpfshash(e.target.value);
  };
  const handle_pm_surveydeadline = (e) => {
    const k = moment(e.target.value, "YYYY-MM-DD hh:mm:ss").unix();
    setSurveydeadline(k);
  };
  const handle_pm_numchoices = (e) => {
    setNumchoices(e.target.value);
  };
  const handle_pm_atmostchoice = (e) => {
    setAtmostchoice(e.target.value);
  };
  const handle_pm_surveyid = (e) => {
    setSurveyid(e.target.value);
  };
  const handle_pm_choices = (e) => {
    setChoices(e.target.value);
  };
  const handle_pm_projectid = (e) => {
    setProjectid(e.target.value);
  };
  const handle_pm_choice = (e) => {
    setChoice(e.target.value);
  };
  const handle_pm_memberaddr = (e) => {
    setMemberaddr(e.target.value);
  };
  const handle_pm_amount = (e) => {
    setAmount(e.target.value);
  };
  const handle_pm_votedeadline = (e) => {
    //setVotedeadline(e.target.value);
    //setVotedeadline(new Date(e.target.value).valueOf());
    const k = moment(e.target.value, "YYYY-MM-DD hh:mm:ss").unix();
    setVotedeadline(k);
  };
  const handle_pm_paymentamounts = (e) => {
    setPaymentamounts(e.target.value);
  };
  const handle_pm_payschedule = (e) => {
    let ar_schedule = e.target.value.split(",");
    for (var i = 0; i < ar_schedule.length; i++) {
      ar_schedule[i] = moment(ar_schedule[i], "YYYY-MM-DD hh:mm:ss").unix();
    }
    setPayschedule(ar_schedule);
  };
  const handle_pm_from = (e) => {
    setFrom(e.target.value);
  };
  const handle_pm_to = (e) => {
    setTo(e.target.value);
  };
  const handle_pm_owner = (e) => {
    setOwner(e.target.value);
  };
  const handle_pm_spender = (e) => {
    setSpender(e.target.value);
  };
  const handle_pm_account = (e) => {
    setAccount(e.target.value);
  };
  const handle_pm_useraddress = (e) => {
    setUseraddress(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Web 3.0</title>
      </Head>

      <div className="container">
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand">Web 3.0</a>
          <button className="btn btn-primary" onClick={txHistory}>
            TX HISTORY
          </button>
          {account > 0 ? (
            <button
              className="btn btn-primary"
              onClick={connectWallet}
              disabled
            >
              Connected
            </button>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Metamask
            </button>
          )}
        </nav>

        <div>
          <div>
            <h6>Account Name: {account}</h6>
            <h6>Account Balance: {balance}</h6>
            <hr />
          </div>
          <div>
            {users.length > 0 && (
              <div>
                <p>{`${users}`}</p>
              </div>
            )}
            <form className="form">
              <div className="d-flex">
                <input
                  className="form-control"
                  onChange={handleChangeInput}
                  placeholder="User Id"
                />

                <button className="btn btn-info ms-2" onClick={getUser}>
                  {"GetUser"}
                </button>
              </div>
            </form>
            <hr />
          </div>
          {/*  */}
          {/* balanceOf */}
          <div>
            {balanceOf && (
              <div>
                <p>{`${JSON.stringify(balanceOf)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_useraddress}
              placeholder="useraddress"
            />
            <br />
            <button className="btn btn-info" onClick={handle_balanceOf}>
              balanceOf
            </button>
            <hr />
          </div>
          {/*  */}
          {/* isMember */}
          <div>
            {isMember && (
              <div>
                <p>{`${JSON.stringify(isMember)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_useraddress}
              placeholder="useraddress"
            />
            <br />
            <button className="btn btn-info" onClick={handle_isMember}>
              isMember
            </button>
            <hr />
          </div>
          {/*  */}
          {/* reserveProjectGrant */}
          <div>
            {reserveProjectGrant && (
              <div>
                <p>{`${JSON.stringify(reserveProjectGrant)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <br />
            <button
              className="btn btn-info"
              onClick={handle_reserveProjectGrant}
            >
              reserveProjectGrant
            </button>
            <hr />
          </div>
          {/*  */}
          {/* submitSurvey */}
          <div>
            {submitSurvey && (
              <div>
                <p>{`${JSON.stringify(submitSurvey)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_ipfshash}
              placeholder="ipfshash : https://...."
              defaultValue="https://"
            />
            <input
              className="form-control"
              onChange={handle_pm_surveydeadline}
              placeholder="surveydeadline: YYYY-MM-DD hh:mm:ss"
              defaultValue="YYYY-MM-DD hh:mm:ss"
            />
            <input
              className="form-control"
              onChange={handle_pm_numchoices}
              placeholder="numchoices"
            />
            <input
              className="form-control"
              onChange={handle_pm_atmostchoice}
              placeholder="atmostchoice"
            />
            <br />
            <button className="btn btn-info" onClick={handle_submitSurvey}>
              submitSurvey
            </button>
            <hr />
          </div>
          {/*  */}
          {/* takeSurvey */}
          <div>
            {takeSurvey && (
              <div>
                <p>{`${JSON.stringify(takeSurvey)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_surveyid}
              placeholder="surveyid"
            />
            <input
              className="form-control"
              onChange={handle_pm_choices}
              placeholder="choices Ex: 2,3 or  4,5"
            />

            <br />
            <button className="btn btn-info" onClick={handle_takeSurvey}>
              takeSurvey
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getSurveyResults */}
          <div>
            {getSurveyResults && (
              <div>
                <p>{`${JSON.stringify(getSurveyResults)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_surveyid}
              placeholder="surveyid"
            />
            <br />
            <button className="btn btn-info" onClick={handle_getSurveyResults}>
              getSurveyResults
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getSurveyInfo */}
          <div>
            {getSurveyInfo && (
              <div>
                <a href={link}>Survey Link</a>
                <p>{`${JSON.stringify(getSurveyInfo)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_surveyid}
              placeholder="surveyid"
            />
            <br />
            <button className="btn btn-info" onClick={handle_getSurveyInfo}>
              getSurveyInfo
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getSurveyOwner */}
          <div>
            {getSurveyOwner && (
              <div>
                <p>{`${JSON.stringify(getSurveyOwner)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_surveyid}
              placeholder="surveyid"
            />
            <br />
            <button className="btn btn-info" onClick={handle_getSurveyOwner}>
              getSurveyOwner
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getNoOfSurveys */}
          <div>
            {getNoOfSurveys && (
              <div>
                <p>{`${JSON.stringify(getNoOfSurveys)}`}</p>
              </div>
            )}

            <button className="btn btn-info" onClick={handle_getNoOfSurveys}>
              getNoOfSurveys
            </button>
            <hr />
          </div>
          {/*  */}
          {/* faucet */}
          <div>
            {faucet && (
              <div>
                <p>{`${JSON.stringify(faucet)}`}</p>
              </div>
            )}

            <button className="btn btn-info" onClick={handle_faucet}>
              faucet
            </button>
            <hr />
          </div>
          {/*  */}
          {/* reserveProjectGrant */}
          <div>
            {reserveProjectGrant && (
              <div>
                <p>{`${JSON.stringify(reserveProjectGrant)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <br />
            <button
              className="btn btn-info"
              onClick={handle_reserveProjectGrant}
            >
              reserveProjectGrant
            </button>
            <hr />
          </div>
          {/*  */}
          {/* withdrawProjectPayment */}
          <div>
            {withdrawProjectPayment && (
              <div>
                <p>{`${JSON.stringify(withdrawProjectPayment)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <br />
            <button
              className="btn btn-info"
              onClick={handle_withdrawProjectPayment}
            >
              withdrawProjectPayment
            </button>
            <hr />
          </div>
          {/*  */}
          {/* votingforinstallment */}
          <div>
            {votingforinstallment && (
              <div>
                <p>{`${JSON.stringify(votingforinstallment)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <input
              className="form-control"
              onChange={handle_pm_choice}
              placeholder="choice"
            />
            <br />
            <button
              className="btn btn-info"
              onClick={handle_votingforinstallment}
            >
              votingforinstallment
            </button>
            <hr />
          </div>
          {/*  */}
          {/* findSchIndex */}
          <div>
            {findSchIndex && (
              <div>
                <p>{`${JSON.stringify(findSchIndex)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <br />
            <button className="btn btn-info" onClick={handle_findSchIndex}>
              findSchIndex
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getIsProjectFunded */}
          <div>
            {getIsProjectFunded && (
              <div>
                <p>{`${JSON.stringify(getIsProjectFunded)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <br />
            <button
              className="btn btn-info"
              onClick={handle_getIsProjectFunded}
            >
              getIsProjectFunded
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getProjectNextPayment */}
          <div>
            {getProjectNextPayment && (
              <div>
                <p>{`${JSON.stringify(getProjectNextPayment)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <br />
            <button
              className="btn btn-info"
              onClick={handle_getProjectNextPayment}
            >
              getProjectNextPayment
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getProjectOwner */}
          <div>
            {getProjectOwner && (
              <div>
                <p>{`${JSON.stringify(getProjectOwner)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <br />
            <button className="btn btn-info" onClick={handle_getProjectOwner}>
              getProjectOwner
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getProjectInfo */}
          <div>
            {getProjectInfo && (
              <div>
                <a href={link}>Project Link</a>
                <p>{`${JSON.stringify(getProjectInfo)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <br />
            <button className="btn btn-info" onClick={handle_getProjectInfo}>
              getProjectInfo
            </button>
            <hr />
          </div>
          {/*  */}
          {/* delegateVoteTo */}
          <div>
            {delegateVoteTo && (
              <div>
                <p>{`${JSON.stringify(delegateVoteTo)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_memberaddr}
              placeholder="memberaddr"
            />
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <br />
            <button className="btn btn-info" onClick={handle_delegateVoteTo}>
              delegateVoteTo
            </button>
            <hr />
          </div>
          {/*  */}
          {/* donateEther */}
          <div>
            {donateEther && (
              <div>
                <p>{`${JSON.stringify(donateEther)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_amount}
              placeholder="amount"
            />
            <br />
            <button className="btn btn-info" onClick={handle_donateEther}>
              donateEther
            </button>
            <hr />{" "}
          </div>
          {/*  */}
          {/* donateMyGovToken */}
          <div>
            {donateMyGovToken && (
              <div>
                <p>{`${JSON.stringify(donateMyGovToken)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_amount}
              placeholder="amount"
            />
            <br />
            <button className="btn btn-info" onClick={handle_donateMyGovToken}>
              donateMyGovToken
            </button>
            <hr />
          </div>
          {/*  */}
          {/* voteForProjectProposal */}
          <div>
            {voteForProjectProposal && (
              <div>
                <p>{`${JSON.stringify(voteForProjectProposal)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <input
              className="form-control"
              onChange={handle_pm_choice}
              placeholder="choice"
            />
            <br />
            <button
              className="btn btn-info"
              onClick={handle_voteForProjectProposal}
            >
              voteForProjectProposal
            </button>
            <hr />
          </div>
          {/*  */}
          {/* submitProjectProposal */}
          <div>
            {submitProjectProposal && (
              <div>
                <p>{`${JSON.stringify(submitProjectProposal)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_ipfshash}
              placeholder="ipfshash: https://..."
              defaultValue="https://"
            />
            <input
              className="form-control"
              onChange={handle_pm_votedeadline}
              placeholder="votedeadline: YYYY-MM-DD hh:mm:ss"
              defaultValue="YYYY-MM-DD hh:mm:ss"
            />
            <input
              className="form-control"
              onChange={handle_pm_paymentamounts}
              placeholder="paymentamounts Ex: 2,3 or  4,5"
            />
            <input
              className="form-control"
              onChange={handle_pm_payschedule}
              placeholder="payschedule Ex: 2,3 or  4,5"
            />
            <br />
            <button
              className="btn btn-info"
              onClick={handle_submitProjectProposal}
            >
              submitProjectProposal
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getNoOfProjectProposals */}
          <div>
            {getNoOfProjectProposals && (
              <div>
                <p>{`${JSON.stringify(getNoOfProjectProposals)}`}</p>
              </div>
            )}

            <br />
            <button
              className="btn btn-info"
              onClick={handle_getNoOfProjectProposals}
            >
              getNoOfProjectProposals
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getNoOfFundedProjects */}
          <div>
            {getNoOfFundedProjects && (
              <div>
                <p>{`${JSON.stringify(getNoOfFundedProjects)}`}</p>
              </div>
            )}

            <br />
            <button
              className="btn btn-info"
              onClick={handle_getNoOfFundedProjects}
            >
              getNoOfFundedProjects
            </button>
            <hr />
          </div>
          {/*  */}
          {/* getEtherReceivedByProject */}
          <div>
            {getEtherReceivedByProject && (
              <div>
                <p>{`${JSON.stringify(getEtherReceivedByProject)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_projectid}
              placeholder="projectid"
            />
            <br />
            <button
              className="btn btn-info"
              onClick={handle_getEtherReceivedByProject}
            >
              getEtherReceivedByProject
            </button>
            <hr />
          </div>
          {/*  */}
          {/* mint */}
          <div>
            {mint && (
              <div>
                <p>{`${JSON.stringify(mint)}`}</p>
              </div>
            )}
            <input
              className="form-control"
              onChange={handle_pm_to}
              placeholder="to"
            />
            <input
              className="form-control"
              onChange={handle_pm_amount}
              placeholder="amount"
            />
            <br />
            {account == "0x70997970c51812dc3a010c7d01b50e0d17dc79c8" && (
              <button className="btn btn-info" onClick={handle_mint}>
                mint
              </button>
            )}
            <hr />
          </div>
        </div>
      </div>
    </>
  );
}

// {
//   /* transferToken */
// }
// <div>
//   {transferToken && (
//     <div>
//       <p>{`${JSON.stringify(transferToken)}`}</p>
//     </div>
//   )}
//   <input className="form-control" onChange={handle_pm_to} placeholder="to" />
//   <input
//     className="form-control"
//     onChange={handle_pm_amount}
//     placeholder="amount"
//   />
//   <br />
//   <button className="btn btn-info" onClick={handle_transferToken}>
//     transferToken
//   </button>
//   <hr />
// </div>;
// {
//   /*  */
// }
// {
//   /* transferTokensFrom */
// }
// <div>
//   {transferTokensFrom && (
//     <div>
//       <p>{`${JSON.stringify(transferTokensFrom)}`}</p>
//     </div>
//   )}
//   <input
//     className="form-control"
//     onChange={handle_pm_from}
//     placeholder="from"
//   />
//   <input className="form-control" onChange={handle_pm_to} placeholder="to" />

//   <input
//     className="form-control"
//     onChange={handle_pm_amount}
//     placeholder="amount"
//   />
//   <br />
//   <button className="btn btn-info" onClick={handle_transferTokensFrom}>
//     transferTokensFrom
//   </button>
//   <hr />
// </div>;
// {
//   /*  */
// }
// {
//   /* allowanceToken */
// }
// <div>
//   {allowanceToken && (
//     <div>
//       <p>{`${JSON.stringify(allowanceToken)}`}</p>
//     </div>
//   )}
//   <input
//     className="form-control"
//     onChange={handle_pm_owner}
//     placeholder="owner"
//   />
//   <input
//     className="form-control"
//     onChange={handle_pm_spender}
//     placeholder="spender"
//   />
//   <br />
//   <button className="btn btn-info" onClick={handle_allowanceToken}>
//     allowanceToken
//   </button>
//   <hr />
// </div>;
// {
//   /*  */
// }
// {
//   /* approveToken */
// }
// <div>
//   {approveToken && (
//     <div>
//       <p>{`${JSON.stringify(approveToken)}`}</p>
//     </div>
//   )}

//   <input
//     className="form-control"
//     onChange={handle_pm_spender}
//     placeholder="spender"
//   />
//   <input
//     className="form-control"
//     onChange={handle_pm_amount}
//     placeholder="amount"
//   />
//   <br />
//   <button className="btn btn-info" onClick={handle_approveToken}>
//     approveToken
//   </button>
//   <hr />
// </div>;
// {
//   /*  */
// }
// {
//   /* totalTokenSupply */
// }
// <div>
//   {totalTokenSupply && (
//     <div>
//       <p>{`${JSON.stringify(totalTokenSupply)}`}</p>
//     </div>
//   )}
//   <br />
//   <button className="btn btn-info" onClick={handle_totalTokenSupply}>
//     totalTokenSupply
//   </button>
//   <hr />
// </div>;
// {
//   /*  */
// }
// {
//   /* tokenBalanceOf */
// }
// <div>
//   {tokenBalanceOf && (
//     <div>
//       <p>{`${JSON.stringify(tokenBalanceOf)}`}</p>
//     </div>
//   )}
//   <input
//     className="form-control"
//     onChange={handle_pm_account}
//     placeholder="account"
//   />
//   <br />
//   <button className="btn btn-info" onClick={handle_tokenBalanceOf}>
//     tokenBalanceOf
//   </button>
//   <hr />
// </div>;
// {
//   /*  */
// }
