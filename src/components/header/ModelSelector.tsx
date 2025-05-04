import React, { useState, useEffect } from "react";
import {
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { apiFetch } from "../../utils/api"; // Assumindo que você tem essa função
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Importe o ícone de seta

interface Model {
  id: string;
  name: string;
}

interface ModelSelectorProps {
  onModelChange: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [loadingModels, setLoadingModels] = useState(true);

  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const data = await apiFetch("/api/models"); // Sua rota para obter a lista de modelos
        if (Array.isArray(data)) {
          setModels(data);
          setSelectedModel(data[0]?.id || null); // Seleciona o primeiro modelo por padrão
        } else {
          console.error("Invalid models data:", data);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  const handleModelClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModelChangeInternal = (modelId: string) => {
    setSelectedModel(modelId);
    onModelChange(modelId); // Chama a função passada como prop
    handleClose();
  };

  return (
    <div>
      <IconButton
        size="small"
        onClick={handleModelClick}
        style={{ padding: 0 }} // Remove o padding padrão do IconButton
      >
        {loadingModels ? (
          <CircularProgress size={16} color="inherit" />
        ) : selectedModel ? (
          <>
            <Typography variant="subtitle1" style={{ marginRight: 4 }}>
              {models.find((model) => model.id === selectedModel)?.name ||
                "Select Model"}
            </Typography>
            <KeyboardArrowDownIcon />
          </>
        ) : (
          "Modelo: gemma3:1b"
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "model-button",
        }}
      >
        {models.map((model) => (
          <MenuItem
            key={model.id}
            onClick={() => handleModelChangeInternal(model.id)}
            selected={model.id === selectedModel}
          >
            {model.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ModelSelector;
