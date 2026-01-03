const ACTIONS = {
    JOIN: 'join',
    JOINED: 'joined',
    DISCONNECTED: 'disconnected',
    CODE_CHANGE: 'code-change',
    SYNC_CODE: 'sync-code',
    LEAVE: 'leave',
    COMPILE_REQ: 'compile-request',
    COMPILE_SUCCESS: 'compile-success',
    COMPILE_ERROR: 'compile-error',
    OUTPUT: 'output'
};

const SUPPORTED_LANGUAGES = [
    { name: 'JavaScript', value: 'javascript', extension: 'js' },
    { name: 'Python', value: 'python', extension: 'py' },
    { name: 'Java', value: 'java', extension: 'java' },
    { name: 'C++', value: 'cpp', extension: 'cpp' },
    { name: 'Go', value: 'go', extension: 'go' }
];

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

const EXECUTION_TIMEOUT = 10000;

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/syncode',
    JWT_SECRET: process.env.JWT_SECRET || 'syncode-secret-key',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    ACTIONS,
    SUPPORTED_LANGUAGES,
    HTTP_STATUS,
    EXECUTION_TIMEOUT
};