const enterUserInContest = require("../contests/contests").enterUserInContest;
const enterUserInContestTester = require("../contests/contests").enterUserInContestTester;


const event= {
    enterUserInContestTester: {
        pathParameters: {
            user_id: 1,
            contest_id: 100
        },
        body: JSON.stringify({
            contest_entry_fee_before_discount_applied: 800,
            discount_percetage_on_contest: 20,
            user_wallet: {
                amount_in_bonus_bucket: 60,
                amount_in_deposit_bucket: 100,
                amount_in_winning_bucket: 840
            }
        })
    }
}


async function runTest() {
    try {
        const response = await enterUserInContestTester(event.enterUserInContestTester);    
        console.log(response);
    } catch (error) {
        console.log(error);   
    }
}

runTest();