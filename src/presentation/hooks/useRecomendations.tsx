import { useState } from 'react';
import { Recommendation } from '../../core/entities/recommendation.entity';
import { askAIRecommendations } from '../../core/use-cases/recommendations/ask-ai-recommendations_use-case';
import { useBooks } from './useBooks';


export const useRecommendations = () => {

    const { myBooks, refetch } = useBooks();

    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

    const fetchRecommendations = async () => {
        setLoadingRecommendations(true);

        await refetch();
        if (myBooks.length === 0) {
            setLoadingRecommendations(false);
            return;
        }

        const fetchedRecommendations = await askAIRecommendations(myBooks);
        setRecommendations(fetchedRecommendations);

        setLoadingRecommendations(false);
    };

    const refetchRecommendations = async () => {
        await fetchRecommendations();
    };

    return {
        loadingRecommendations,
        recommendations,
        refetchRecommendations,
    };

};
