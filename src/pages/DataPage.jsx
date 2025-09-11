import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Typography, Paper, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";


export const DataApp = () => {
  const [tabInfo, setTabInfo] = useState({ url: '', title: '' });
  const [message, setMessage] = useState('');
  const [taskData, setTaskData] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Data from Window
  useEffect(() => {
    const onMessage = (event) => {
      if (!event?.data) return;
      if (event.data.type === 'tabInfo') {
        setTabInfo({ url: event.data.url || '', title: event.data.title || '' });
      }
    };
    window.addEventListener('message', onMessage);

    // Ask the parent (extension sidepanel) for initial data
    window.parent.postMessage({ type: 'requestInitialData' }, '*');

    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Check if tab is ClickUp and extract taskId
  useEffect(() => {
    if (tabInfo.url) {
      if (tabInfo.url.startsWith('https://app.clickup.com/t/')) {
        const parts = tabInfo.url.split('/t/');
        if (parts.length === 2) {
          setTaskId(parts[1]);
          setMessage('');
        } else {
          setMessage(`Open ClickUp Tasks Page to Start. Your current tab is ${tabInfo.url}`);
          setTaskId(null);
        }
      } else {
        setMessage(`Open ClickUp Tasks Page to Start. Your current tab is ${tabInfo.url}`);
        setTaskId(null);
      }
      setLoading(false); // Stop initial loading once tabInfo is processed
    }
  }, [tabInfo.url]);

  // Fetch task data from the backend if taskId is set
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!taskId) return;

      setLoading(true);
      try {
        const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
          headers: {
            Authorization: "0000000000000000000000000000000000000000000000",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch task data');
        }
        const data = await response.json();
        setTaskData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskData();
  }, [taskId]);

  // Convert timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(parseInt(timestamp)).toLocaleString();
  };

  // Render message if not a ClickUp task
  if (!taskId && message) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h6">
          {message}
        </Typography>
      </Container>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading task data...
        </Typography>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Define the fields to display with safe access
  const fields = [
    { key: 'Current Tab URL', value: tabInfo.url ?? 'N/A' },
    { key: 'Current Tab Title', value: tabInfo.title ?? 'N/A' },
    { key: 'Task ID', value: taskData?.id ?? 'N/A' },
    { key: 'Name', value: taskData?.name ?? 'N/A' },
    { key: 'Text Content', value: taskData?.text_content ?? 'N/A' },
    { key: 'Description', value: taskData?.description ?? 'N/A' },
    { key: 'Status', value: taskData?.status?.status ?? 'N/A' },
    { key: 'Date Created', value: formatDate(taskData?.date_created) },
    { key: 'Date Updated', value: formatDate(taskData?.date_updated) },
    { key: 'Date Done', value: taskData?.date_done ?? 'N/A' },
    { key: 'Creator Name', value: taskData?.creator?.username ?? 'N/A' },
    { key: 'Team ID', value: taskData?.team_id ?? 'N/A' },
    { key: 'List ID', value: taskData?.list?.id ?? 'N/A' },
    { key: 'List Name', value: taskData?.list?.name ?? 'N/A' },
    { key: 'Project ID', value: taskData?.project?.id ?? 'N/A' },
    { key: 'Project Name', value: taskData?.project?.name ?? 'N/A' },
    { key: 'Folder ID', value: taskData?.folder?.id ?? 'N/A' },
    { key: 'Folder Name', value: taskData?.folder?.name ?? 'N/A' },
    { key: 'Space ID', value: taskData?.space?.id ?? 'N/A' },
    { key: 'Space Name', value: taskData?.space?.name ?? 'N/A' },
  ];

  return (<>
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button onClick={() => navigate("/")}>Home  </Button>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Task Details
        </Typography>
        <List>
          {fields.map((field, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={field.key}
                secondary={field.value}
                primaryTypographyProps={{ fontWeight: 'bold' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
    </>
  );
};

// export default DataApp;