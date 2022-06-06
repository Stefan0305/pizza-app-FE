import { useContext, useState } from "react";
import Api from '../../Api';
import { TagContext } from "../../context/tagContext";

const TagManagerPage = () => {
    const { tags, setTags } = useContext(TagContext);
    const [tag, setTag] = useState('');
    const handleTagChange = (e) => setTag(e.target.value);
    const submitTag = () => {
        Api().post('/tags', { tag }).then(response => {
            console.log(response);
            setTag('');
            setTags([...tags, {tag}]);
        }).catch(console.error);
    };
    const handleKeyDown = (e) => e.key === 'Enter' ? submitTag() : null;
    return (
        <div id="tags">
            {tags.map(tagItem => (
                <li> {tagItem.tag}</li>
            ))}
            <input type="text" value={tag} onChange={handleTagChange}  onKeyDown={handleKeyDown} />
            <button onClick={submitTag}>Add tag</button>
        </div>
    );
};

export default TagManagerPage;