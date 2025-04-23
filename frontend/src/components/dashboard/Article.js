import { Card, CardContent, Typography, CardMedia, Divider} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Article = ({ article, slug, renderEntirePage = false}) => {
    const navigate = useNavigate();

    const renderArticle = () => {
        return <Card sx = {{ height: 350, width: 300}} onClick={() => navigate(`/dashboard/education/articles/${slug}`)}>
            <CardMedia component="img" image={article.image}/>
            <CardContent>
                <Typography variant="h6">{article.title}</Typography>
                <Typography sx={{ fontSize: 16, marginTop: 0.5}} color="text.secondary">{article.date_created}</Typography>
                <Typography sx={{ fontSize: 12, marginTop: 1.5}} color="text.secondary">Tags: {article.tags.join(", ")}</Typography>
            </CardContent>
        </Card>
    };

    const renderEntireArticle = () => {
       return <div>
        <p id="title">{article.title}</p>
        <Card sx = {{ marginLeft: 3, height: 600, width: 600}} onClick={() => navigate(`/dashboard/education/articles/${slug}`)}>
            <CardContent>
                <Typography sx={{ fontSize: 16, marginTop: 0.5}} color="text.secondary">Date Published: {article.date_created}</Typography>
                <Divider sx= {{ marginTop: 1, marginBottom: 2}} />
                <Typography sx={{ fontSize: 16, marginTop: 0.5}} color="text.secondary">{article.content}</Typography>
                <Divider sx= {{ marginTop: 2, marginBottom: 1}} />
                <Typography sx={{ fontSize: 12, marginTop: 1.5}} color="text.secondary">Tags: {article.tags.join(", ")}</Typography>
            </CardContent>
        </Card>
       </div>
    }

    return <> 
    {article ? renderEntirePage ? renderEntireArticle() : renderArticle(): navigate("/not-found")}
    </>
};

export default Article;