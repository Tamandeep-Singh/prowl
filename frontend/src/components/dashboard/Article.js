import { Card, CardContent, Typography, CardMedia, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';

const Article = ({ article, slug, renderEntirePage = false}) => {
    const navigate = useNavigate();

    const renderArticle = () => {
        return <Card sx = {{ height: 350, width: 300}} onClick={() => navigate(`/dashboard/education/articles/${slug}`)}>
            <CardMedia height="150" component="img" image={article.image}/>
            <CardContent>
                <Typography variant="h6">{article.title}</Typography>
                <Typography sx={{ fontSize: 16, marginTop: 0.5}} color="text.secondary">{article.date_created}</Typography>
                <Typography sx={{ fontSize: 12, marginTop: 1.5}} color="text.secondary">Tags: {article.tags.join(", ")}</Typography>
            </CardContent>
        </Card>
    };

    const renderEntireArticle = () => {
       return <div style={{ width: "80vw", display: "flex", justifyContent: "center"}}>
        <Card sx = {{ marginTop: 2, height: 750, width: 1200}} onClick={() => navigate(`/dashboard/education/articles/${slug}`)}>
                <CardMedia sx={{objectFit: "cover", width: "100%", height: 180, marginBottom: -1}} component="img" image={article.image}/>
                <CardContent>
                    <Typography variant="h5" sx= {{ marginBottom: 1}}>{article.title}</Typography>
                    <Typography sx={{ fontSize: 16, marginTop: 0.5}} color="text.secondary">Published on {article.date_created}</Typography>
                    <Divider sx= {{ marginTop: 1, marginBottom: 2}} />
                    <Typography sx={{ fontSize: 16, marginTop: 0.5}} color="text.secondary" dangerouslySetInnerHTML = {{ __html: DOMPurify.sanitize(article.content)}}></Typography>
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