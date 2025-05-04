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
  name: string; // O ID agora é a propriedade 'name' diretamente
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
    additionalProperties: null;
  };
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
        const response = await apiFetch("/ollama/findModels"); // Sua rota para obter a lista de modelos
        if (response && Array.isArray(response.models)) {
          setModels(response.models);
          setSelectedModel(response.models[0]?.name || "gemma3:1b"); // Seleciona o primeiro modelo pelo 'name' ou um padrão
        } else {
          console.error("Invalid models data:", response);
          setLoadingModels(false);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setLoadingModels(false);
      } finally {
        if (models.length === 0) {
          setLoadingModels(false);
        }
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

  const handleModelChangeInternal = (modelName: string) => {
    setSelectedModel(modelName);
    onModelChange(modelName); // Chama a função passada como prop com o nome do modelo
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
              {models.find((model) => model.name === selectedModel)?.name ||
                "Modelo: gemma3:1b"}
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
            key={model.name}
            onClick={() => handleModelChangeInternal(model.name)}
            selected={model.name === selectedModel}
          >
            {model.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ModelSelector;
