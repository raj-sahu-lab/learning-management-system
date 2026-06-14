# Rest Api Node and Mysql

## Description
This is an Restful API for Node.js and Mysql. Designed after PHP's beautiful Laravel. This is in the MVC format,
except because it is an API there are no views, just models and controllers.

##### Routing         : Express
##### ORM Database    : Sequelize
##### Authentication  : Passport, JWT

#### Create .env File
You will find a example.env file in the home directory. Paste the contents of that into a file named .env in the same directory. 
Fill in the variables to fit your application

## Testing

This project uses [Jest](https://jestjs.io/) and [Supertest](https://github.com/visionmedia/supertest) for automated testing. No real database or external service connection is needed — all dependencies are mocked.

### Run tests

```bash
npm test
```

### Run tests with coverage report

```bash
npm run test:coverage
```

### Test files

| File | What it covers |
|------|---------------|
| `__tests__/auth.test.js` | Institute login endpoint (POST `/v1/institute/user/login`): validation errors (400), invalid credentials (422), expired/missing plan (402), successful login (200 + JWT). Also covers protected route rejection (401) and forgot-password validation. |
| `__tests__/middleware/auth.test.js` | JWT token structure, expiry logic, CryptoJS payload round-trip, Bearer token extraction, and the `errorHandler` middleware for JWT/validation/500 errors. |
| `__tests__/utils.test.js` | Pure utility functions in `services/V1/util.service.js`: `to()`, `toWithout()`, `ReE()`, `ReS()`, `ReS1()`, `TE()`, and the `currentDateFormat` global helper. |
| `__tests__/validation.test.js` | All express-validator middleware chains: `institutionLoginValidation`, `forgotPasswordValidation`, `studentRegisterValidation`, `verifyOTPValidation`, `newInstituteValidation`, `addCouponValidation`, `sendNotificationValidation`. |

### Adding new tests

1. Create a new file under `__tests__/` following the pattern `<feature>.test.js`.
2. Mock heavy dependencies (database, external APIs) at the top of the file using `jest.mock(...)`.
3. Use the helpers in `__tests__/helpers/mockDB.js` (`makeAccountInstance`, `makePlanInstance`, `makeStudentInstance`) to create fake model instances.
4. For route-level tests, build a minimal Express app using only the controller and middleware you need — avoid importing the full `routes/v1.js` to keep mocking overhead low.
5. Run `npm test` to verify.

