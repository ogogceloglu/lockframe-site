# Privacy and release review

This is a technical inventory, not legal advice. It records what the current repository proves and
what must be confirmed before public launch.

## Reviewed implementation

| Area | Evidence in `LockFrame` | Finding used in the site |
|---|---|---|
| Rewarded ads | `Assets/_Lockframe/Scripts/Meta/Commerce/AdMobRewardedAdService.cs`, `Docs/AdMobSetup.md` | AdMob rewarded only; first Adventure death; UMP before ad requests; no reward without Google's earned callback |
| Consent | same files | UMP update/form flow; Privacy Options when required; AdMob console message still needs setup |
| ATT | `Docs/AdMobSetup.md`, `Docs/SecurityReview060.md` | no ATT prompt in current configuration; policy avoids claiming that Google processes no identifiers |
| Analytics | `Assets/_Lockframe/Scripts/Services/Services.cs`, `ProjectSettings/UnityConnectSettings.asset` | gameplay events are local debug logs only; Unity Analytics and Cloud Diagnostics disabled; ad SDK diagnostics still apply |
| In-app purchases | `AppleCommerceService.cs`, `Backend/src/apple.js`, `Backend/src/wallet.js` | StoreKit 2 JWS verification, exactly-once credit and refund handling are implemented; no card data received by LOCKFRAME |
| Player account/wallet | `Backend/sql/001_init.sql` through `003_device_credentials.sql` | random player UUID, credential hashes, wallet/ledger, purchase records and timestamps are stored server-side when deployed |
| Apple identity | `Assets/Plugins/iOS/LockframeAppTransaction.swift`, `NativeIdentity.cs`, `Backend/src/apple.js` | App Transaction recovery plus Sign in with Apple identity-token flow; no name/email request in the reviewed implementation |
| Deployment state | `Docs/PurchaseRecovery.md`, `Docs/LAUNCH_PLAN.md` | wallet backend, live StoreKit verification, production AdMob setup and device recovery validation are not yet complete |

## 0.7.1 policy update (2026-10-12, branch `privacy-0.7.1`, not published)

The policy now discloses the following; it is based on `LockFrame/Docs/PrivacyPolicyReview070.md`:
- **Unity In-App Purchasing 5.4 purchase telemetry to Unity Technologies:**
  - IDFV, read unconditionally on iOS by the package (`PlayerData.CreatePlayerIdentityAsync`);
  - Unity installation and session ids;
  - device info (model, OS, locale, boot time, disk size);
  - product and App Store transaction id;
  - app version and install time;
  - country.
  This was verified from the package source; a device proxy capture is recommended.
- In-app account deletion and what is kept.
- Sign in with Apple revocation handling (TN3194).
- Restored Prism cosmetics.
- The new Account & Privacy path.
- In-memory IP use for rate limiting.
- Azure North Europe hosting; 7-day backups.
- The Apple Watch data flow.

App Store Connect "App Privacy" answers must match the matrix in
`LockFrame/Docs/PrivacyPolicyReview070.md` §5. Unity adds the **Analytics** purpose to Device ID,
Purchase History, Product Interaction, Coarse Location and Other Diagnostic Data. Tracking stays
**No**.

## Must be resolved before public launch

1. **Account deletion (0.7.x, 2026-10-12): implemented.**
   - In-app path: Help → Account & Privacy → Delete Account, two steps.
   - Server: `DELETE /v1/account` (deployed to staging; production pending).
   - Sign in with Apple: LOCKFRAME stores no Apple tokens, so per Apple TN3194 the app shows the
     manual revocation steps (support.apple.com/102571).
   - Still open:
     - production deployment;
     - the **retention period** for pseudonymous financial records of deleted accounts (the policy
       says "being confirmed"; do not invent one).
2. Confirm the data controller's full legal name, postal address and jurisdiction. The current public
   contact is the verified real address `ogulcangogceloglu@gmail.com`; do not invent a company or
   support alias.
3. Have counsel confirm legal bases, applicable user rights, international transfer language,
   transaction/anti-fraud retention and concrete response/retention periods.
4. Choose and document the production wallet host, database region, backup retention, application and
   platform log retention, subprocessors, deletion behavior and disaster-recovery copies.
5. In AdMob, create and approve the required GDPR message and decide whether a US states message is
   needed. Review Google's Publisher first-party ID behavior and the final shipping SDK privacy
   manifests. Reconcile the website policy with the App Store privacy questionnaire.
6. Decide the final age rating and intended audience. Set child-directed and under-age-of-consent
   treatment where required; the current ad request code sets neither flag.
7. Test on physical devices in relevant regions: UMP accept/decline/revisit, test rewarded ad,
   no-consent behavior, StoreKit sandbox purchase/refund, App Transaction recovery, Sign in with Apple
   fallback and multi-device recovery.
8. Compare `app-ads.txt` with the exact personalized snippet in **AdMob → Settings → Account**. The
   committed line is the requested line and matches Google's standard syntax, but this review cannot
   access the private AdMob account.
9. Add the public App Store URL only after the listing is live. Recheck the Privacy Policy against the
   exact binary submitted to App Review and update the effective date/status language.
10. Confirm whether separate Terms of Use/EULA and a user-privacy-choices URL are needed.

## Current `app-ads.txt`

```text
google.com, pub-2858109238421461, DIRECT, f08c47fec0942fa0
```

Google references:

- <https://support.google.com/admob/answer/2784578>
- <https://support.google.com/admob/answer/9776740/resolve-issues-with-app-ads-txt>
- <https://developers.google.com/admob/ios/privacy>
- <https://developers.google.com/admob/ios/privacy/ad-serving-modes>

