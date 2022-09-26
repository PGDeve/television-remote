export default {
    initializeApp: jest.fn(),
    database: jest.fn().mockReturnValue({
        ref: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
                exists: jest.fn().mockReturnValue(true),
                val: jest.fn().mockReturnValue({
                    key: 'value'
                }),
            }),
            remove: jest.fn(),
            set: jest.fn(),
            orderByChild: jest.fn().mockReturnValue({
                get: jest.fn().mockReturnValue({
                    exists: jest.fn().mockReturnValue(true),
                    val: jest.fn().mockReturnValue({
                        key: 'value'
                    }),
                }),
            })
        })
    }),
    credential: {
        cert: jest.fn()
    }
};