import "../../css/base.css";
import { useState } from "react";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Dialog, DialogTitle, DialogContent, Button, DialogActions, Chip, InputBase, Container, Grid } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ArticleData from "./Cybersecurity_Articles.json";
import Article from "./Article";

const EducationHub = ({ slug  }) => {
    const [showInformationPopup, setShowInformationPopup] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [query, setQuery] = useState("");
   

    const onShowInformationPopup = () => {
      setShowInformationPopup(true);
    };

    const onCloseShowInformationPopup = () => {
      setShowInformationPopup(false);
    };

    const renderArticles = () => {
      return <div>
      <p id="title">Education Hub <IconButton onClick={onShowInformationPopup} sx={{ marginBottom: 0.1}}><InfoIcon sx={{ color: "white"}}/></IconButton></p>
      <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
          <DialogTitle>Education Hub: Page Guide</DialogTitle>
          <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
              <p style={{ marginTop: -3, marginBottom: 0 }}>The Education Hub provides detailed articles to educate users about Cybersecurity, varying from all ranges of attacks and their potential impact. All articles are <strong>static</strong> meaning that even if the API is experiencing problems, articles can be added and also read with no interference.</p>
              <p>Any information obtained from the articles should provide a <strong>fundamental understanding</strong> of the vulnerability explored and hence help when investigating alerts <strong>independently</strong> and level up your Cybersecurity knowledge.</p>
          </DialogContent>
          <DialogActions>
              <Button onClick={onCloseShowInformationPopup}color="primary">Close</Button>
          </DialogActions>
      </Dialog>
      <InputBase onChange={({ target } ) => setQuery(target.value)} sx={{ padding: 0.5, border: 1, borderRadius: 2, backgroundColor: "white", marginLeft: 2.4, width: 370, height: 45, fontSize: 17}} placeholder="Search Articles" startAdornment={<SearchIcon sx={{ marginRight: 1.3, paddingLeft: 1}}/>}>
      </InputBase>
      <div style={{ marginLeft: 20, marginTop: 12}}>
        {ArticleData.filterTags.map(tag => (
          <Chip sx={{ 
            marginRight: 1.5,
            fontSize: 14,
            padding: 0.5,
            backgroundColor: selectedTag === tag ? "#1976d2" : "#4a4f5c", 
            color: "#fff",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: selectedTag === tag ? "#1565c0" : "#5a5f6b",
            },
          }} key={tag} label={tag} size="medium" clickable onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}/>
      ))}
      </div>
      <Container sx={{ paddingY: 4 }}>
          <Grid sx={{ width: "80vw"}} container spacing={3}>
          {query ? ArticleData.articles.filter(article => article.title.toLowerCase().includes(query.toLowerCase())).map(article => (
            <Grid item key={article.slug}>
              <Article article={article} slug={article.slug}/>
            </Grid>)) :
          selectedTag ? ArticleData.articles.filter(article => article.tags.includes(selectedTag)).map(article => (
            <Grid item key={article.slug}>
              <Article article={article} slug={article.slug}/>
            </Grid>)) : ArticleData.articles.map(article => (
              <Grid item key={article.slug}>
                <Article article={article} slug={article.slug}/>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    };

    const renderArticleBySlug = () => {
      return <Article article={ArticleData.articles.find(article => article.slug === slug)} slug={slug} renderEntirePage={true}/>
    };

    return <div>
      {slug ? renderArticleBySlug() : renderArticles()}
    </div>
};

export default EducationHub;