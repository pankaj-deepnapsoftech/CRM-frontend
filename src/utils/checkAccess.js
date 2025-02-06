export const checkAccess = (auth, route)=>{
    const {allowedroutes, isSubscribed, isSubscriptionEnded, isTrial, isTrialEnded, account} = auth;

    let isAllowed = false;
    let msg = '';

    if(isSubscribed && !isSubscriptionEnded && allowedroutes.includes(route)){
        isAllowed = true;
    }
    else if(isTrial && !isTrialEnded && allowedroutes.includes(route)){
        isAllowed = true;
    }
    
    if(((account?.type === 'trial' && isSubscribed && !isTrialEnded) || (isSubscribed && !isSubscriptionEnded)) && !allowedroutes.includes(route)){
        msg = 'You are not authorized to access this route.';
    }
    else if(isSubscriptionEnded){
        msg = 'Your subscription has expired.';
    }
    else if(isTrialEnded){
        msg = 'Your trial period is over';
    }
    else if(!isTrialEnded && !allowedroutes.includes(route)){
        msg = 'Subscribe to continue.';
    }
    else{
        msg = 'Activate trial account or Subscribe to continue';
    }

    return {isAllowed, msg};
}