import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { createPost, getImageURL } from "../api/api";
import { useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '../utils/Alerts';
import { LoadingSpinner } from '../utils/CommonStates';
import { useTheme } from '../hooks/useTheme';

Quill.register('modules/imageResize', ImageResize);


const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  
  const navigate = useNavigate(); 
  const quillRef = useRef(null);
  const username = localStorage.getItem("username") || '';
  const token = localStorage.getItem("token") || '';
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const { darkMode } = useTheme();

  const categories = ["Tech", "Lifestyle", "Health", "Education", "Travel", "Finance", "Food", "Entertainment", "Sports", "Fashion", "Music", "Politics", "Science", "Art", "Business", "Environment", "Other"];
  
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .ql-toolbar .ql-picker-options {
        max-height: 200px;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .ql-picker-options::-webkit-scrollbar {
        display: none;
      }
      
      .ql-picker-label {
        overflow: visible !important;
      }


      .ql-link {
        margin-top: 8px !important;
      }
      
      /* Fix for link tooltip/dialog */
      .ql-tooltip {
        left: 20px !important;
        z-index: 9999 !important;
        position: absolute !important;
      }
      
      /* Ensure input field in link dialog is visible */
      .ql-tooltip input[type=text] {
        width: 170px !important;
        display: inline-block !important;
      }
      
      /* Make sure the tooltip appears above everything */
      .ql-snow .ql-tooltip {
        position: absolute;
        transform: translateY(10px) !important;
      }

      .ql-snow .ql-picker.ql-expanded .ql-picker-options {
        display: block;
        margin-top: 1px;
        top: 100%;
        z-index: 2;
      }
      
      ${darkMode ? `
        .ql-toolbar.ql-snow {
          background-color: #1d2d50 !important;
          border-color: #2a3f5f !important;
        }
        
       .ql-formats button svg {
          background-color: #cbd5e1 !important;}
        
        .ql-toolbar.ql-snow .ql-picker {
          color: #ffffff !important;
        }
        
        .ql-toolbar.ql-snow .ql-picker-options {
          background-color: #142037 !important;
          border-color: #2a3f5f !important;
        }
        
        .ql-container.ql-snow {
          border-color: #2a3f5f !important;
        }
        
        .ql-editor {
          background-color: #0a111e !important;
          color: #ffffff !important;
        }
        
        /* Dark mode styling for the link tooltip */
        .ql-snow .ql-tooltip {
          background-color: #1d2d50 !important;
          border-color: #2a3f5f !important;
          color: #ffffff !important;
        }
        
        .ql-snow .ql-tooltip input[type=text] {
          background-color: #142037 !important;
          border-color: #3a5bb0 !important;
          color: #ffffff !important;
        }
        
        .ql-snow .ql-tooltip a.ql-action,
        .ql-snow .ql-tooltip a.ql-remove {
          color: #4c70dd !important;
        }

      ` : ''}
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [darkMode]);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);
  
      try {
        const response = await getImageURL(token, formData)
    
        const quill = quillRef.current.getEditor();
          
        const range = quill.getSelection(true);
          
        quill.insertEmbed(range.index, 'image', response.imageUrl);
          
        quill.setSelection(range.index + 1); 
      } catch (error) {
        console.error('Error uploading image:', error);
        setAlertMessage('Failed to upload image. Please try again.');
        setAlertType('error');
      }
    };
  },[token])
  
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link', 'image',],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    imageResize: {
      parchment: Quill.import('parchment'),
    },
  }), [imageHandler]);
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!title.trim() || !content.trim() || !category.trim()) {
      setAlertMessage('Please fill in all fields');
      setAlertType('warning');
      return ;
    }
    const token = localStorage.getItem("token") || 'abc';
    try {
      setLoading(true);
      await createPost(title, category, content, tags, token, username);
      setAlertMessage('Post added successfully!');
      setAlertType('success');
      navigate('/blogs');
      
    } catch (error) {
      console.error("Error submitting post:", error);
      console.log('error', error)
      setAlertMessage('Failed to submit post. Please try again.');
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput && tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  if (alertMessage) return <Alert message={alertMessage} type={alertType} />;

  if(loading) return <LoadingSpinner />

  // MUI component styling based on dark mode
  const textFieldSx = {
    backgroundColor: darkMode ? '#142037' : 'white',
    '& .MuiFilledInput-root': {
      backgroundColor: darkMode ? '#142037' : 'white',
    },
    '& .MuiFilledInput-root:hover': {
      backgroundColor: darkMode ? '#1a2a4d' : 'white',
    },
    '& .MuiFilledInput-root.Mui-focused': {
      backgroundColor: darkMode ? '#1a2a4d' : 'white',
    },
    '& .MuiInputLabel-root': {
      color: darkMode ? '#a0aec0' : 'inherit',
    },
    '& .MuiInputBase-input': {
      color: darkMode ? '#e2e8f0' : 'inherit',
    },
    '& .MuiFilledInput-underline:before': {
      borderBottomColor: darkMode ? '#3a5bb0' : 'inherit',
    },
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: darkMode ? '#4c70dd' : 'inherit',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: darkMode ? '#2a3f5f' : 'inherit',
    },
  };

  return (
    <div className={`p-4 pt-6 border rounded-lg ${darkMode ? 'bg-[#0a111e] text-white border-[#2a3f5f]' : 'bg-white shadow-md'} m-5 overflow-visible`}>
      <h2 className={`text-center text-2xl font-bold mb-6 ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' : 'text-blue-600'}`}>
        ✨ Share Your Thoughts ✨
      </h2>

      <form onSubmit={handleSubmit} style={{ fontFamily: "poppins" }}>
          <Box
            component="form"
            sx={{ marginBottom: 2, marginTop: 1, minWidth: 120, width: '100%', borderRadius: 2 }}
            noValidate
            autoComplete="off"
          >
            <TextField  
              required 
              sx={{
                ...textFieldSx,
                '& .MuiFilledInput-root': {
                  borderRadius: '8px', 
                },
              }}
              slotProps={{ htmlInput: { maxLength: 30 } }} 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              fullWidth 
              id="filled-basic" 
              label="Title" 
              variant="filled"
            />
          </Box>

        <Box sx={{ minWidth: 120, marginBottom: 2, borderRadius: 2 }}>
          <FormControl fullWidth variant="filled" sx={textFieldSx}>
            <InputLabel id="demo-simple-select-label" sx={{ color: darkMode ? '#cbd5e1' : 'inherit' }}>Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              required
              sx={{ color: darkMode ? 'white' : 'inherit' }}
            >
              {
                categories.map((category, index) => (
                  <MenuItem key={index} value={category} sx={{ color: darkMode ? 'white' : 'inherit', '&:hover': {color: darkMode ? 'black' : 'inherit'},backgroundColor: darkMode ? '#1d2d50' : 'inherit' }}>{category}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Box>

        <div className={`${darkMode ? 'text-white' : ''} rounded-md relative`}>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Start writing your blog post..."
            className={`mb-4 ${darkMode ? 'dark-editor' : ''}`}
            modules={modules}
          />
        </div>

        <Box sx={{ marginBottom: 3, borderRadius: 2 }}>
          <TextField
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            fullWidth
            sx={{
              ...textFieldSx,
              '& .MuiFilledInput-root': {
                borderRadius: '8px',
              }
            }}
            slotProps={{ htmlInput: { maxLength: 20 } }}
            label="Add a Tag"
            variant="filled"
            placeholder="Type a tag and press Enter"
          />

          <Stack direction="row" spacing={1} className='mt-2 flex-wrap'>
            {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                  sx={{
                    backgroundColor: darkMode ? '#3a5bb0' : '',
                    '& .MuiChip-label': {
                      color: darkMode ? 'white' : '',
                    },
                    '& .MuiChip-deleteIcon': {
                      color: darkMode ? 'white' : '',
                      '&:hover': {
                        color: darkMode ? '#cbd5e1' : '',
                      },
                    },
                    marginBottom: '8px',
                  }}
                />
              ))}
          </Stack>
        </Box>

        <button
          type="submit"
          className={`px-6 py-3 text-white rounded-full transition-colors duration-300 font-semibold ${
            darkMode 
              ? 'bg-blue-600 hover:bg-[#0f192c] hover:border-2 hover:border-white' 
              : 'bg-blue-500'
          }`}
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;