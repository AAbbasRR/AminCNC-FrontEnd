export const IndexFrequentlyQuestionAPI = () => ({
    method: 'get',
    url: 'questions/api/index/',
});

export const AllFrequentlyQuestionAPI = (page = 1) => ({
    method: 'get',
    url: 'questions/api/all/',
    params: {
        page: page
    }
});