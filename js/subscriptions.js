/* ============================================
    SUBSCRIPTION PAGE
-----------------------------------------------
    Author: Siti Norlie Yana
    Date: 31 December 2025
    Tested by:
    Updated by:
    Description:
    Handles subscription management and billing
   ============================================ */

/* ============================================
   SUBSCRIPTIONS.JS
   ============================================ */

const SubscriptionState = {
    currentPlan: { name: 'Free Plan', price: 0, nextBillingDate: '-' },
    autoRenew: false,
    paymentMethod: { type: 'None', last4: '' },
    planKey: 'free'
};

const PLAN_NAMES = { free: 'Free Plan', standard: 'Standard Plan', premium: 'Premium Plan' };

function updateCurrentPlanDisplay() {
    document.getElementById('currentPlanName').textContent = SubscriptionState.currentPlan.name;
    document.getElementById('planPrice').textContent = "RM" + SubscriptionState.currentPlan.price.toFixed(2);
    document.getElementById('nextBillingDate').textContent = SubscriptionState.currentPlan.nextBillingDate;
    document.getElementById('autoRenewLabel').textContent = SubscriptionState.autoRenew ? 'ON' : 'OFF';
    document.getElementById('paymentMethod').textContent = SubscriptionState.paymentMethod.type + 
        (SubscriptionState.paymentMethod.last4 ? ' **** ' + SubscriptionState.paymentMethod.last4 : '');

    document.querySelectorAll('.upgrade-btn').forEach(btn=>{
        btn.classList.toggle('current-plan', btn.dataset.plan === SubscriptionState.planKey);
    });
}

function loadSubscriptionData() {
    fetch('api/get_subscription.php')
    .then(r=>r.json())
    .then(data=>{
        if(data.error){ console.error(data.error); return; }

        SubscriptionState.planKey = data.subscription_plan.toLowerCase() || 'free';
        SubscriptionState.currentPlan.name = PLAN_NAMES[SubscriptionState.planKey] || 'Free Plan';
        SubscriptionState.currentPlan.price = parseFloat(data.plan_price);
        SubscriptionState.currentPlan.nextBillingDate = data.next_billing_date || '-';
        SubscriptionState.autoRenew = data.auto_renew == 1;

        if(data.payment_method && data.payment_method.includes('****')){
            const parts = data.payment_method.split('****');
            SubscriptionState.paymentMethod.type = parts[0].trim();
            SubscriptionState.paymentMethod.last4 = parts[1].trim();
        } else {
            SubscriptionState.paymentMethod.type = data.payment_method || 'None';
            SubscriptionState.paymentMethod.last4 = '';
        }

        updateCurrentPlanDisplay();
    })
    .catch(err=>console.error(err));
}

function toggleAutoRenew(){
    const newStatus = SubscriptionState.autoRenew ? 0 : 1;
    fetch('api/update_auto_renew.php',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({auto_renew:newStatus})
    })
    .then(r=>r.json())
    .then(data=>{
        if(data.success){
            SubscriptionState.autoRenew = !SubscriptionState.autoRenew;
            updateCurrentPlanDisplay();

            // Toggle visual class
            const toggleSwitch = document.getElementById('autoRenewToggle');
            if(toggleSwitch){
                toggleSwitch.classList.toggle('active', SubscriptionState.autoRenew);
            }

            alert('Auto-Renew updated!');
        } else alert('Failed to update Auto-Renew');
    })
    .catch(()=>alert('Error updating Auto-Renew'));
}

document.addEventListener('DOMContentLoaded', ()=>{
    loadSubscriptionData();
    setupEventListeners();

    // Ensure toggle visually matches data on load
    const toggleSwitch = document.getElementById('autoRenewToggle');
    if(toggleSwitch){
        toggleSwitch.classList.toggle('active', SubscriptionState.autoRenew);
    }

});

function editPaymentMethod(){
    const current = SubscriptionState.paymentMethod.type + (SubscriptionState.paymentMethod.last4 ? ' **** ' + SubscriptionState.paymentMethod.last4 : '');
    const newMethod = prompt('Enter new payment method:', current);
    if(!newMethod) return;

    fetch('api/update_payment_method.php',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({payment_method:newMethod})
    })
    .then(r=>r.json())
    .then(data=>{
        if(data.success){
            const parts = newMethod.includes('****') ? newMethod.split('****') : [newMethod,''];
            SubscriptionState.paymentMethod.type = parts[0].trim();
            SubscriptionState.paymentMethod.last4 = parts[1].trim();
            updateCurrentPlanDisplay();
            alert('Payment method updated!');
        } else alert('Failed to update payment method');
    })
    .catch(()=>alert('Error updating payment method'));
}

function upgradePlan(planKey){
    const planPrice = planKey === 'standard' ? 5.99 : planKey === 'premium' ? 15.99 : 0;
    if(!confirm(`Upgrade to ${PLAN_NAMES[planKey]} for RM${planPrice}?`)) return;

    fetch('api/update_subscription.php',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({plan:planKey, price:planPrice})
    })
    .then(r=>r.json())
    .then(data=>{
        if(data.success){
            loadSubscriptionData(); // reload from server to get next billing date
            alert(`Upgraded to ${PLAN_NAMES[planKey]}!`);
        } else alert('Failed to upgrade plan: '+(data.error||''));
    })
    .catch(()=>alert('Error upgrading plan'));
}

function cancelSubscription(){
    if(!confirm('Cancel subscription?')) return;

    fetch('api/cancel_subscription.php',{
        method:'POST',
        headers:{'Content-Type':'application/json'}
    })
    .then(r=>r.json())
    .then(data=>{
        if(data.success){
            loadSubscriptionData(); // reload Free Plan from server automatically
            alert('Subscription cancelled! You are now on the Free Plan.');
        } else alert('Failed to cancel subscription');
    })
    .catch(()=>alert('Error cancelling subscription'));
}


function setupEventListeners(){
    document.getElementById('autoRenewToggle')?.replaceWith(
        document.getElementById('autoRenewToggle').cloneNode(true)
    );

    document.getElementById('editPaymentBtn')?.replaceWith(
        document.getElementById('editPaymentBtn').cloneNode(true)
    );

    document.getElementById('cancelSubscriptionBtn')?.replaceWith(
        document.getElementById('cancelSubscriptionBtn').cloneNode(true)
    );

    document.querySelectorAll('.upgrade-btn').forEach(btn=>{
        const newBtn = btn.cloneNode(true);
        btn.replaceWith(newBtn);
        newBtn.addEventListener('click', ()=>upgradePlan(newBtn.dataset.plan));
    });

    document.getElementById('autoRenewToggle')?.addEventListener('click', toggleAutoRenew);
    document.getElementById('editPaymentBtn')?.addEventListener('click', editPaymentMethod);
    document.getElementById('cancelSubscriptionBtn')?.addEventListener('click', cancelSubscription);
}
