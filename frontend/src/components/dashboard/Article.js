import { Card, CardContent, Typography, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Article = ({ article, slug }) => {
    const navigate = useNavigate();

    const renderArticle = () => {
        return <Card onClick={() => navigate(`/dashboard/education/articles/${slug}`)}>
            <CardMedia component="img" height="180" image={article.image}/>
            <CardContent>
                <Typography variant="h6">{article.title}</Typography>
                <Typography sx={{ fontSize: 16, marginTop: 0.5}} color="text.secondary">{article.date_created}</Typography>
                <Typography sx={{ fontSize: 12, marginTop: 1.5}} color="text.secondary">Tags: {article.tags.join(", ")}</Typography>
            </CardContent>
        </Card>
    };

    return <> 
    {article ? renderArticle() : navigate("/not-found")}
    </>
};

export default Article;