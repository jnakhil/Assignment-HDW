'use strict';


/**
 * 
 * @param {JSON} event A regular JSON event received in lambda handler from AWS API Gateway when using Lambda Proxy Integration
 * Description: Enters a User in a contest and re-adjust user's wallet. Assumes that Wallet has enough value such that the user can participate in contest.
 * Path: users/{user_id}/contest/{contest_id}
 * Verb: POST
 */
exports.enterUserInContest = async (event) => {
    if (event && event.pathParameters && event.pathParameters.user_id && event.pathParameters.contest_id && event.body) {
        try {
            event.body = JSON.parse(event.body);

            /**
             * To be done: Apply request body validation.
             * -- Mandatory field validation
             * -- Data type validation
             * -- Discount percent range validation => (0 - 100)
             * 
             * For now assumed that request body would be valid.
             */

            var user_id = event.pathParameters.user_id;
            var contest_id = event.pathParameters.contest_id;

            // Denotes e1
            var contest_entry_fee_before_discount_applied = event.body.contest_entry_fee_before_discount_applied;
            var discount_percetage_on_contest = event.body.discount_percetage_on_contest;

            // Denotes e2
            var contest_entry_fee_after_discount_applied = contest_entry_fee_before_discount_applied * (1 - discount_percetage_on_contest / 100);

            /**
             * To do in function:
             * Step 1. Query existing wallet data for user from Database.
             * Step 2. Deduct contest_entry_fee_after_discount_applied from all the wallet buckets in order as given.
             * Step 3. Update the wallet data for user => Only update 
             */
            

            // Step 1
            var load_user_wallet_data = await code_to_query_user_wallet_info_from_db();

            var user_wallet = {
                amount_in_bonus_bucket: 60,
                amount_in_deposit_bucket: 100,
                amount_in_winning_bucket: 340
            }

            // Step 2
            var updated_wallet = await updateWalletByDeductingContestEntryFees(user_wallet, contest_entry_fee_after_discount_applied);

            // Step 3
            var update_user_wallet_query_response = await code_to_update_user_wallet_in_db();

            var response = {
                user_wallet: updated_wallet
            }

            return {
                statusCode: 200,
                body: JSON.stringify(response),
            }; 

        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify(error.message)
            }
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify("Invalid request structure. Either body or path parameter missing in request.")
        }
    }
};

async function updateWalletByDeductingContestEntryFees(user_wallet, total_amount_to_deduct) {
    try {

        if (total_amount_to_deduct > 0) {

            var max_amount_to_be_deducted_from_bonus = 0.1 * total_amount_to_deduct;

            var actual_amount_deducted_from_bonus = 0;
            var actual_amount_deducted_from_deposit = 0;
            var actual_amount_deducted_from_winning = 0;


            actual_amount_deducted_from_bonus = (max_amount_to_be_deducted_from_bonus <= user_wallet.amount_in_bonus_bucket) ? max_amount_to_be_deducted_from_bonus : user_wallet.amount_in_bonus_bucket;
            total_amount_to_deduct -= actual_amount_deducted_from_bonus;
            user_wallet.amount_in_bonus_bucket -= actual_amount_deducted_from_bonus;

            actual_amount_deducted_from_deposit = (total_amount_to_deduct <= user_wallet.amount_in_deposit_bucket) ? total_amount_to_deduct : user_wallet.amount_in_deposit_bucket;
            total_amount_to_deduct -= actual_amount_deducted_from_deposit;
            user_wallet.amount_in_deposit_bucket -= actual_amount_deducted_from_deposit;
            
            actual_amount_deducted_from_winning = total_amount_to_deduct;
            total_amount_to_deduct -= actual_amount_deducted_from_winning;
            user_wallet.amount_in_winning_bucket -= actual_amount_deducted_from_winning;
        }

        return user_wallet;

    } catch (error) {
        throw error;
    }
}


/**
 * 
 * @param {JSON} event A regular JSON event received in lambda handler from AWS API Gateway when using Lambda Proxy Integration
 * Description: Funtion declared to test above function locally. Difference being that this test function takes in all the paramter of user_wallet as well. So it doesn't depends on DB query.
 *      It just modifies the wallet and return modified wallet.
 */
exports.enterUserInContestTester = async (event) => {
    if (event && event.pathParameters && event.pathParameters.user_id && event.pathParameters.contest_id && event.body) {
        try {
            event.body = JSON.parse(event.body);

            /**
             * To be done: Apply request body validation.
             * -- Mandatory field validation
             * -- Data type validation
             * -- Discount percent range validation => (0 - 100)
             * 
             * For now assumed that request body would be valid.
             */

            var user_id = event.pathParameters.user_id;
            var contest_id = event.pathParameters.contest_id;

            // Denotes e1
            var contest_entry_fee_before_discount_applied = event.body.contest_entry_fee_before_discount_applied;
            var discount_percetage_on_contest = event.body.discount_percetage_on_contest;

            // Denotes e2
            var contest_entry_fee_after_discount_applied = contest_entry_fee_before_discount_applied * (1 - discount_percetage_on_contest / 100);

            /**
             * To do in function:
             * Step 1. Query existing wallet data for user from Database.
             * Step 2. Deduct contest_entry_fee_after_discount_applied from all the wallet buckets in order as given.
             * Step 3. Update the wallet data for user => Only update 
             */
            

            // Step 1
            // var load_user_wallet_data = await code_to_query_user_wallet_info_from_db();
            var load_user_wallet_data = event.body.user_wallet;

            var user_wallet = {
                amount_in_bonus_bucket: load_user_wallet_data.amount_in_bonus_bucket,
                amount_in_deposit_bucket: load_user_wallet_data.amount_in_deposit_bucket,
                amount_in_winning_bucket: load_user_wallet_data.amount_in_winning_bucket
            }

            // Step 2
            var updated_wallet = await updateWalletByDeductingContestEntryFees(user_wallet, contest_entry_fee_after_discount_applied);

            // Step 3
            // var update_user_wallet_query_response = await code_to_update_user_wallet_in_db();

            var response = {
                user_wallet: updated_wallet
            }

            return {
                statusCode: 200,
                body: JSON.stringify(response),
            }; 

        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify(error.message)
            }
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify("Invalid request structure. Either body or path parameter missing in request.")
        }
    }
};