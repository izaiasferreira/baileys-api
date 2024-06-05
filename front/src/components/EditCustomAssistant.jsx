import './EditCustomAssistant.css';
import React, { useCallback, useContext, useEffect } from 'react'
import { ApiBack } from '../service/axios';
import { AppContext } from '../contexts/userData';
import { useState } from 'react';
import InputText from './InputText';
import InputRounded from './InputRounded';
import InputRoundedOption from './InputRoundedOption';
import InputRoundedOptionChildren from './InputRoundedOptionChildren';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputSelect from './InputSelect';
import FilesPreview from './FilesPreview';
import IconButton from './IconButton';
import ButtonModel from './ButtonModel';
import BubblesContainer from './BubblesContainer';
import InputTextArea from './InputTextArea';
import InputCheckbox from './InputCheckbox';
import EmojiComponent from './EmojiComponent';
import MessageComponent from './MessageComponent';
import 'reactflow/dist/style.css'
import { addEdge, Background, Controls, Handle, MarkerType, MiniMap, Position, ReactFlow } from 'reactflow';
import CodeEditor from '@uiw/react-textarea-code-editor';
import Button from './Button';
import Bar from './Bar';
import Space from './Space';
import { v4 as uuidv4 } from 'uuid';
import { AES, enc } from 'crypto-js';
import DialogBoxChildren from './DialogBoxChildren';
import PrimaryButton from './PrimaryButton';
import SecoundaryButton from './SecoundaryButton';
import DialogBox from './DialogBox';
import BookmarkForList from './BookmarkForList';
import BookmarkForListMessageArea from './BookmarkForListMessageArea';
import { debounce } from '@mui/material';
import LateralBar from './LateralBar';
import EditCustomAssistantChat from './EditCustomAssistantChat';

const nodeTypes = {
    section: Section
};

export default function EditCustomAssistant({ assistant }) {
    const {
        edges,
        setEdges,
        onEdgesChange,
        nodes,
        setNodes,
        onNodesChange,
        createAreaData,
        setCreateAreaData,
        setBookmarks,
        setSectorsList,
        setConnectionsList
    } = useContext(AppContext)
    const [dialogBoxEdgeDelete, setDialogBoxEdgeDelete] = useState(false)
    const [LateralBarChatState, setLateralBarChatState] = useState(false)
    const [edgeToDelete, setEdgeToDelete] = useState(null)
    // const [assistant, setAssistant] = useState(null)
    useEffect(() => {
        // console.log(nodes);
        debounce(() => {
            ApiBack.post(`assistant/nodes?id=${assistant?._id}`, nodes)
            ApiBack.post(`assistant/edges?id=${assistant?._id}`, edges)
        }, 300)

    }, [setNodes, nodes, setEdges, edges])


    useEffect(() => {
        fetch()
        if (assistant) {
            ApiBack.get(`assistant/allNodes?id=${assistant?._id}`).then((response) => {
                var data
                if (response.data.length > 0) {
                    data = response.data
                } else {
                    data = [createSection(assistant?._id)]
                    data[0].data.sections[0].isStart = true
                }
                // fs.writeFileSync('data.json', JSON.stringify(data, null, 2)) 
                // console.log(data);
                setNodes(JSON.parse(JSON.stringify(data)))
            })
            ApiBack.get(`assistant/edges?id=${assistant?._id}`).then((response) => {
                response.data = response.data.map((edge) => {
                    return {
                        ...edge, type: 'smoothstep'
                    }
                })
                setEdges(JSON.parse(JSON.stringify(response.data)) || [])
            })
        }

    }, [assistant])
    async function fetch() {

        var responseBookmarks = await ApiBack.get('bookmarks')
        setBookmarks(responseBookmarks.data)

        var sectorResponse = await ApiBack.get(`sectors`)
        setSectorsList(sectorResponse.data)

        var responseConnections = await ApiBack.get('connection/getAllConnections')
        setConnectionsList(responseConnections.data)
    }

    function onConnect(params) {
        setEdges((eds) => {
            const edge = createEdgeSwipe(assistant?._id, params)
            var resultConnect = connectTwoNodes({ nodeSource: params.source, nodeTarget: params.target, nodes: nodes })
            if (!resultConnect.error) {
                setNodes(resultConnect.data)
                return addEdge(edge, eds)
            } else return addEdge({}, eds)

        })
    }
    function connectTwoNodes({ nodeSource, nodeTarget }) {
        var nodesCopy = JSON.parse(JSON.stringify(nodes))
        var nodesIds = nodesCopy.map((node) => node.id)
        var nodeSourceIndex = nodesIds.findIndex((node) => node === nodeSource)
        var nodeTargetIndex = nodesIds.findIndex((node) => node === nodeTarget)
        if (nodeSourceIndex !== -1 && nodeTargetIndex !== -1) {
            nodesCopy[nodeSourceIndex].data.children.push(nodesCopy[nodeTargetIndex].id)
            nodesCopy[nodeTargetIndex].data.parent.push(nodesCopy[nodeSourceIndex].id)
            // o source recebe o nextStep do target
            var sourceLength = nodesCopy[nodeSourceIndex]?.data?.sections.length
            var nextStepId = nodesCopy[nodeTargetIndex]?.data?.sections[0].id
            nodesCopy[nodeSourceIndex].data.sections[sourceLength - 1].options[0].nextStep = nextStepId
            // console.log(nodesCopy[nodeSourceIndex].data.sections[sourceLength - 1].options[0]);
            //o target recebe o backStep do source
            if (!nodesCopy[nodeTargetIndex]?.data?.sections[0].options[0].backStep) {
                var backStepId = nodesCopy[nodeSourceIndex]?.data?.sections[sourceLength - 1].id
                nodesCopy[nodeTargetIndex].data.sections[0].options[0].backStep = backStepId
                // console.log(nodesCopy[nodeTargetIndex].data.sections[0].options[0]);
            }
            // var previousStepId = nodesCopy[nodeSourceIndex]?.data?.sections[sourceLength - 1].id

            // nodesCopy[nodeTargetIndex].data.sections[0].options[0].previousStep = previousStepId
            return { error: false, data: nodesCopy }
        }
        return { error: true, data: nodesCopy }
    }
    // Função para criptografar os dados
    const encryptData = (data, encryptionKey) => {
        const encryptedData = AES.encrypt(JSON.stringify(data), encryptionKey).toString();
        return data.toString(enc.Utf8)/* encryptedData */;
    };

    // Função para descriptografar os dados
    const decryptData = (encryptedData, encryptionKey) => {
        const decryptedBytes = AES.decrypt(encryptedData, encryptionKey);
        const decryptedData = JSON.parse(decryptedBytes.toString(enc.Utf8));
        return JSON.parse(encryptedData.toString(enc.Utf8))/* decryptedData */;
    };
    // Função para exportar os dados
    const handleExport = (data, encryptionKey, nameAssistant) => {
        const encryptedData = encryptData(data, encryptionKey);
        const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nameAssistant + '.ctk';
        link.click();
    };
    // Função para importar os dados
    const handleImport = async (event, encryptionKey, onLoad) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            const encryptedData = e.target.result;
            // console.log(encryptedData);
            // const decryptedData = decryptData(encryptedData, encryptionKey);
            onLoad(encryptedData)
        };
        reader.readAsText(file);
    };
    function deleteEdge(edgeSelected, nodes) {
        var nodesCopy = JSON.parse(JSON.stringify(nodes))
        var nodeSourceIndex = nodesCopy.findIndex((node) => node.id === edgeSelected.source)
        var nodeTargetIndex = nodesCopy.findIndex((node) => node.id === edgeSelected.target)

        nodesCopy[nodeSourceIndex].data.children = nodesCopy[nodeSourceIndex].data.children?.filter((node) => node !== edgeSelected.target) || []
        nodesCopy[nodeTargetIndex].data.parent = nodesCopy[nodeTargetIndex].data.parent?.filter((node) => node !== edgeSelected.source) || []

        var sourceLength = nodesCopy[nodeSourceIndex]?.data?.sections.length
        nodesCopy[nodeSourceIndex].data.sections[0].options[sourceLength - 1].nextStep = null
        nodesCopy[nodeTargetIndex].data.sections[0].options[0].backStep = null

        setEdges(oldEdges => oldEdges.filter(edge => edge.id !== edgeSelected.id))
        setNodes(nodesCopy)
        setDialogBoxEdgeDelete(false)
    }


    return (
        <div className="edit-custom-assistant-container">
            <ToastContainer />
            <div className="div" style={{ position: 'absolute', top: '5rem', left: '1.5rem', zIndex: '99999' }}>
                <ButtonModel onClick={() => {
                    ApiBack.post(`assistant/nodes?id=${assistant?._id}`, nodes)
                    ApiBack.post(`assistant/edges?id=${assistant?._id}`, edges)
                    toast.success('Alterações salvas.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }}> <i className='bx bxs-save'></i>Salvar Alterações</ButtonModel>
                <ButtonModel onClick={() => {
                    var dataNodesCopy = nodes.map(({ _id, ...dataObject }) => dataObject).map(({ __v, ...dataObject }) => dataObject)
                    var dataEdgesCopy = edges.map(({ _id, ...dataObject }) => dataObject).map(({ __v, ...dataObject }) => dataObject)
                    handleExport(JSON.stringify({ nodes: dataNodesCopy, edges: dataEdgesCopy }), REACT_APP_SECRET_KEY_ASSISTANT, assistant.name)
                }}> <i className='bx bxs-cloud-download' ></i>Exportar Assistente</ButtonModel>
                <ButtonModel onClick={() => {
                    document.getElementById('inputDataAssistant').click();
                }}> <i className='bx bxs-cloud-upload' ></i>Importar Assistente</ButtonModel>
                <input style={{ display: 'none' }} type="file" onChange={(event) => {
                    handleImport(event, REACT_APP_SECRET_KEY_ASSISTANT, (data) => {
                        data = JSON.parse(JSON.parse(JSON.stringify(data)))
                        var assistantId = assistant?._id
                        var dataNodes = JSON.parse(JSON.stringify(data.nodes))
                        dataNodes = dataNodes.map((node) => {
                            node.data.assistantId = assistantId
                            return node
                        })
                        var dataEdges = JSON.parse(JSON.stringify(data.edges))
                        dataEdges = dataEdges.map((edge) => {
                            edge.assistantId = assistantId
                            return edge
                        })
                        // console.log(dataEdges, dataNodes);
                        setNodes(dataNodes)
                        setEdges(dataEdges)
                        ApiBack.post(`assistant/nodes?id=${assistant?._id}`, dataNodes)
                        ApiBack.post(`assistant/edges?id=${assistant?._id}`, dataEdges)
                        toast.success('Assistente importado e salvo com sucesso.', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                    })
                    event.target.value = ''
                }
                } id="inputDataAssistant" />
            </div>
            {<div className="div" style={{
                position: 'absolute',
                top: '50%',
                left: '1.5rem',
                zIndex: '99999',
                justifyContent: 'space-around',
                display: 'flex',
                flexDirection: 'column',
                height: '7rem',
                backgroundColor: 'var(--two-color)',
                padding: '.5rem',
                borderRadius: '50rem'
            }}>
                <IconButton onClick={() => {
                    var nodesCopy = JSON.parse(JSON.stringify(nodes))
                    nodesCopy.push(createNewSection({
                        assistantId: assistant?._id,
                        positionX: 100,
                        positionY: 100
                    }))
                    setNodes(JSON.parse(JSON.stringify(nodesCopy)))
                }}>
                    <i className='bx bx-message-square-add' />
                </IconButton>
                <IconButton onClick={() => {
                    setCreateAreaData(null)
                    setLateralBarChatState(!LateralBarChatState)
                }}>
                    <i className='bx bx-bot' ></i>
                </IconButton>
            </div>}
            <div className="show-schema" id='show-schema'>
                <LateralBar open={LateralBarChatState} onClose={() => setLateralBarChatState(false)} >
                    <EditCustomAssistantChat assistantId={assistant?._id} />
                </LateralBar>
                <DialogBox
                    open={dialogBoxEdgeDelete}
                    text='Deseja excluir esta aresta?'
                    buttonOneText='Excluir'
                    buttonTwoText='Cancelar'
                    onButtonTwo={!setDialogBoxEdgeDelete}
                    onClose={!setDialogBoxEdgeDelete}
                    onButtonOne={() => {
                        deleteEdge(edgeToDelete, nodes)
                    }}
                />
                <ReactFlow
                    proOptions={{ hideAttribution: true }}
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={(value) => {
                        onEdgesChange(value)
                        var edgeSelected = edges.find(edge => edge.id === value[value.length - 1].id)
                        if (!edgeSelected.label) {
                            setEdgeToDelete(edgeSelected)
                            setDialogBoxEdgeDelete(true)
                        } else {
                            toast.error('Não é possível excluir linhas de opções.', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",

                            })
                        }
                    }}
                    onConnect={onConnect}
                    snapToGrid={true}
                    fitView
                    attributionPosition="top-right"
                >
                    <MiniMap style={{ backgroundColor: 'var(--one-color)', left: 40, bottom: 0, width: 150, height: 100 }} nodeColor={"#66b3ff"} nodeStrokeWidth={3} zoomable pannable />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
            {createAreaData && assistant ? <CreateArea data={createAreaData} assistant={assistant} /> : null}

        </div >
    )
}

function CreateArea({ data, assistant }) {
    const [dataStep, setDataStep] = useState(null)
    const [stateStepBefore, setStateStepBefore] = useState(null)
    const [stateFilesObject, setStateFilesObject] = useState(null)
    const { edges, setEdges, nodes, setNodes, setCreateAreaData } = useContext(AppContext)
    const excludeTypes = ['transfer', 'bookmark', 'sendRequest', 'notificationWhatsapp', 'removeBookmark', 'modelDify', 'condition']
    const disableTypes = ['simpleMessage, inputOptions, options', 'transfer', 'bookmark', 'sendRequest', 'notificationWhatsapp', 'modelDify', 'condition']
    const [anchorEmoji, setAnchorEmoji] = useState(null);
    const targetEmoji = (event) => {
        setAnchorEmoji(event)
    }
    const dataBubbles = [
        {
            icon: <i className='bx bx-image' ></i>,
            name: 'Imagem',
            action: () => { click('file-image-assist') },
            color: '#F55064'
        },
        {
            icon: <i className='bx bx-video' ></i>,
            name: 'Video',
            action: () => { click('file-video-assist') },
            color: '#ff9800'
        },
        {
            icon: <i className='bx bx-music' ></i>,
            name: 'Audio',
            action: () => { click('file-audio-assist') },
            color: '#d22929'
        },
        {
            icon: <i className='bx bx-file'></i>,
            name: 'Documento',
            action: () => { click('file-document-assist') },
            color: '#4caf50'
        }/* ,
        {
            icon: <i className='bx bx-sticker' ></i>,
            name: 'Sticker',
            action: () => { click('file-sticker-assist') },
            color: '#9c27b0'
        } */
    ]
    useEffect(() => {
        setDataStep(data)
        setStateStepBefore({ type: data.type, options: data.options })
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setCreateAreaData(null)
            }
        });
    }, [data])

    function typeStepForCreate(dataStep, callBack, setNegativeMessage, callBackDataStep) {
        const { type, options } = dataStep
        if (type === 'inputOptions') {
            return <TypeInputOptions data={dataStep} setNegativeMessage={(value) => { setNegativeMessage(value) }} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'simpleMessage') {
            if (!verifyIsSimpleMessage(options)) {
                var dataNodesCopy = JSON.parse(JSON.stringify(nodes))
                var index = dataNodesCopy?.findIndex(node => node.id === dataStep.section)
                var thisStepIndex = dataNodesCopy[index]?.data.sections.findIndex(step => step.id === dataStep.id)
                callBack([{
                    nextStep: dataNodesCopy[index]?.data.sections[thisStepIndex + 1]?.id || null,
                    backStep: dataNodesCopy[index]?.data.sections[thisStepIndex - 1]?.id || null,
                }])
            }
            return null
        }
        if (type === 'transfer') {
            if (!dataStep.isEnd) {
                dataStep = { ...dataStep, isEnd: true }
                callBackDataStep(dataStep)
            }
            return <TypeTransfer data={dataStep} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'modelDify') {
            return <TypeModelDify data={dataStep} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'options') {
            return <TypeOptions data={dataStep} setNegativeMessage={(value) => { setNegativeMessage(value) }} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'input') {
            return <TypeInput data={dataStep} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'sendRequest') {
            return <TypeSendRequest data={dataStep} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'survey') {
            return <TypeSurvey data={dataStep} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'bookmark') {
            return <TypeBookmark data={dataStep} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'removeBookmark') {
            return <TypeRemoveBookmark data={dataStep} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'notificationWhatsapp') {
            return <TypeNotificationWhatsapp data={dataStep} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'condition') {
            return <TypeCondition data={dataStep} updateOptions={(options) => { callBack(options) }} />
        }
        if (type === 'otherAssistant') {
            return <TypeTransferOtherAssistant data={dataStep} updateOptions={(options) => { callBack(options) }} />
        }

        function verifyIsSimpleMessage(options) {
            if (
                options[0].hasOwnProperty('nextStep') &&
                options[0].hasOwnProperty('backStep') &&
                !options[0].hasOwnProperty('type') &&
                !options[0].hasOwnProperty('id') &&
                !options[0].hasOwnProperty('name') &&
                !options[0].hasOwnProperty('value') &&
                !options[0].hasOwnProperty('options')
            ) {
                return true
            } else {
                return false
            }

        }
    }
    async function convertToWebp(file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => (img.onload = resolve));
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const blob = await new Promise((resolve) =>
            canvas.toBlob((blob) => resolve(blob), 'image/webp')
        );
        return new File([blob], file.name.substring(0, file.name.indexOf('.')) + '.webp', { type: 'image/webp' });
    }
    async function uploadFile(element) {
        var type = element?.type
        var file = type === 'sticker' ? await convertToWebp(element?.file?.target?.files[0]) : element?.file?.target?.files[0]
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file?.name);
        formData.append('typeUpload', type);
        var index = file?.type?.indexOf('/')
        var responseData
        await ApiBack.post('connection/uploadFile', formData)
            .then((response) => {
                responseData = response.data
            }).catch((err) => {
                responseData = err.response.data
                toast.error(err.response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            })
        responseData.name = file?.name
        responseData.extension = file.type.substring(index + 1, file.type.length)
        return responseData
    }

    function click(id) {
        document.getElementById(id).click();
    }

    function showFileToUpload(e, type) {
        setStateFilesObject({ type: type, file: e })
    }

    function updateTypeStep(value) {
        var dataStepCopy = JSON.parse(JSON.stringify(dataStep))
        setStateStepBefore({ type: dataStepCopy.type, options: dataStepCopy.options })
        var dataStepUpdated = { ...dataStepCopy, type: value }
        if (['inputOptions', 'simpleMessage', 'options'].includes(dataStepUpdated.type) && !dataStepUpdated?.message) {
            dataStepUpdated.message = createMessage()
        }
        if (['condition'].includes(dataStepUpdated.type) && dataStepUpdated?.message) {
            dataStepUpdated.message = null
        }
        // console.log(dataStepUpdated);
        setDataStep(dataStepUpdated)
    }
    function filterActions(section, options) {
        var optionsIds = options.map((option) => option.id)
        var dataNodesCopy = JSON.parse(JSON.stringify(nodes));
        const indexParentSection = dataNodesCopy.findIndex(node => node.id === section)
        var dataNode = dataNodesCopy[indexParentSection]
        //filter add
        var filter = options.reduce((acc, curr) => {
            var indexNode = dataNodesCopy.findIndex(node => node.id === curr.id)
            if (indexNode === -1) {
                acc.add.push(curr)
            }
            return acc
        }, { delete: [], add: [], update: [] })
        //filter delete
        var nodesChildrens = dataNodesCopy.filter(node => dataNode.data.children?.includes(node.id))
        var nodesChildrensIdsFiltered = nodesChildrens.filter(node => !optionsIds.includes(node.id))
        filter.delete = [...nodesChildrensIdsFiltered.map(node => node.id)]
        //filter updade
        var nodesChildrensExists = nodesChildrens.filter(node => optionsIds.includes(node.id))
        var nodesChildrensExistsIds = nodesChildrensExists.map(node => node.id)
        filter.update = [...nodesChildrensExistsIds]
        return filter
    }
    function updatePositions(dataNodesCopy, dataNode, positionsX) {
        var nodesChildrens = dataNodesCopy.filter(node => dataNode.data.children?.includes(node.id))
        var nodesNotChildrens = dataNodesCopy.filter(node => !dataNode.data.children?.includes(node.id))
        var childrensWithNewPositions = nodesChildrens.map((node, index) => {
            node.position.x = positionsX[index]
            return node
        })
        return dataNodesCopy = [...nodesNotChildrens, ...childrensWithNewPositions]
    }
    function addNodesChilds(dataStepId, section, options, nodesAndEdges) {
        var dataNodesCopy = JSON.parse(JSON.stringify(nodesAndEdges.nodes));

        var edgesCopy = JSON.parse(JSON.stringify(nodesAndEdges.edges))
        var indexThisNode = dataNodesCopy.findIndex(node => node.id === section)
        var filter = filterActions(section, options)
        if (filter.add?.length > 0) {
            const positionsX = calcPositionX(dataNodesCopy[indexThisNode], options?.length || 0)
            const positionY = calcPositionY(dataNodesCopy[indexThisNode]) + dataNodesCopy[indexThisNode]?.position?.y || 0 + 700
            // console.log(dataNodesCopy[indexThisNode].data.sections[0].options);
            var result = filter.add.map((optionData) => {
                var newNode = createSection(assistant?._id, optionData.id, 0, positionY, [...dataNodesCopy[indexThisNode].data.parent, dataNodesCopy[indexThisNode].id])
                newNode.data.sections[0].options[0].backStep = dataStepId //adiciona o passo anterior
                dataNodesCopy[indexThisNode]['data']['children'].push(newNode.id) //adiciona o objeto filho ao pai
                var edge = createEdge(assistant?._id, section, newNode.id, options.find(option => option.id === optionData.id).value)
                return {
                    node: newNode,
                    edge: edge
                }
            })
            var newNodes = result.map(result => result.node)
            var newEdges = result.map(result => result.edge)
            dataNodesCopy.push(...newNodes)
            edgesCopy.push(...newEdges)
            dataNodesCopy = updatePositions(dataNodesCopy, dataNodesCopy[indexThisNode], positionsX)
        }
        if (filter.delete?.length > 0) {
            const positionsX = calcPositionX(dataNodesCopy[indexThisNode], options.length)
            dataNodesCopy = dataNodesCopy.filter(node => !filter.delete.includes(node.id) && !checkIfContains(node.data.parent, filter.delete))
            edgesCopy = deleteEdges(edgesCopy, dataNodesCopy)
            dataNodesCopy = updatePositions(dataNodesCopy, dataNodesCopy[indexThisNode], positionsX)
        }
        if (filter.update?.length > 0) {
            for (let index = 0; index < filter.update.length; index++) {
                let option = options.find(option => option.id === filter.update[index])
                var indexEdgeToUpdate = edgesCopy.findIndex(edge => edge.target === option.id)
                if (indexEdgeToUpdate !== -1) {
                    edgesCopy[indexEdgeToUpdate] = createEdge(assistant?._id, edgesCopy[indexEdgeToUpdate].source, edgesCopy[indexEdgeToUpdate].target, option.value)
                }
            }
            console.log(edgesCopy);
        }
        console.log(dataNodesCopy[indexThisNode].data.sections[0].options);
        // dataNodesCopy[indexThisNode].data.sections[0].options = dataNodesCopy[indexThisNode].data.sections[0].options
        return { edges: edgesCopy, nodes: dataNodesCopy }

        // setNodes(dataNodesCopy)
        // setEdges(edgesCopy)
    }

    function updateNodes(dataStep, nodes) {
        const updateNodes = [...nodes]
        const nodesUpdated = updateNodes.map((node) => {
            node.data.sections = node.data.sections.map((step) => {
                if (step.id === dataStep.id) {
                    return dataStep
                } else { return step }
            })
            return node
        })
        return JSON.parse(JSON.stringify(nodesUpdated))
    }

    function calcHeightMessage(message) {
        const numCaracters = message.length;
        const height = Math.ceil(numCaracters / 33) * 15;
        return height;
    }

    function calcPositionX(dataNode, quantityNodes) {
        const x = dataNode.position.x
        const n = quantityNodes
        const posicoes = [];
        const distancia = 450;

        // calcula a posição do meio
        let meio = x;
        if (n % 2 === 0) {
            meio -= distancia / 2;
        }
        posicoes.push(meio);

        // calcula as posições à esquerda
        let posicaoAtual = meio - distancia;
        while (posicaoAtual >= x - n / 2 * distancia) {
            posicoes.unshift(posicaoAtual);
            posicaoAtual -= distancia;
        }

        // calcula as posições à direita
        posicaoAtual = meio + distancia;
        while (posicaoAtual <= x + n / 2 * distancia) {
            posicoes.push(posicaoAtual);
            posicaoAtual += distancia;
        }

        return posicoes;
    }

    function calcPositionY(dataNode) {
        const { data: { sections } } = dataNode
        var calc = 0
        for (let index = 0; index < sections.length; index++) {
            const stepData = sections[index]
            const { type, options, message } = stepData
            if (type === 'options' || type === 'inputOptions') {
                calc += calcHeightMessage(message?.text || '') + (Math.ceil(66 / 33) * 15) + (15 * options.length) + (15 * 8) + (message?.file ? 300 : 0)
            }
            if (type === 'start' || type === 'input') {
                calc += calcHeightMessage(message?.text || '') + (15 * 2) + (15 * 5) + (message?.file ? 300 : 0)
            }
            if (type === 'simpleMessage' || type === 'transfer') {
                calc += calcHeightMessage(message?.text || '') + (15 * 5) + (message?.file ? 300 : 0)
            }

        }
        return calc - 300
    }
    function TextAreaContition(dataStep, stateFilesObject) {
        var status = true
        if (stateFilesObject && ['sticker', 'audio'].includes(stateFilesObject?.type)) {
            status = false
        }
        if (dataStep?.message?.file && ['sticker', 'audio'].includes(dataStep?.message?.file?.type)) {
            status = false
        }

        return status
    }
    return <div className="create-area">
        <div className="sectition-one">
            {
                dataStep?.message?.file || stateFilesObject?.file && !excludeTypes.includes(dataStep?.type) ?
                    <div className="file-preview">
                        <div className="head">
                            <InputCheckbox
                                disable={disableTypes.includes(dataStep?.type) ? false : true}
                                placeholder='Deseja enviar uma mensagem?'
                                onChange={(value) => {
                                    var dataStepCopy = JSON.parse(JSON.stringify(dataStep));
                                    if (!value) {
                                        dataStepCopy.message = null
                                    }
                                    if (value) {
                                        dataStepCopy.message = createMessage()
                                    }
                                    setDataStep(dataStepCopy)
                                }}
                                state={dataStep ? true : false}
                            />
                            <IconButton onClick={() => {
                                var dataStepCopy = JSON.parse(JSON.stringify(dataStep));
                                const newMessage = { ...dataStepCopy.message, file: null, type: { typeMessage: 'text', toShow: false } }
                                const updateStep = { ...dataStepCopy, message: newMessage }
                                setDataStep(updateStep)
                                setStateFilesObject({ file: null, type: null })
                            }}
                            >
                                <i className='bx bx-x'></i>
                            </IconButton>
                        </div>
                        <FilesPreview file={dataStep?.message?.file ? { file: dataStep?.message?.file, type: dataStep?.message?.file?.type } : stateFilesObject} onlyShow={dataStep?.message?.file?.url} />
                        {
                            dataStep?.message?.file || stateFilesObject ?
                                !dataStep?.message?.file ?
                                    <ButtonModel
                                        onClick={() => {
                                            uploadFile(stateFilesObject).then((result) => {
                                                console.log(result);
                                                if (!result.error) {
                                                    var dataStepCopy = JSON.parse(JSON.stringify(dataStep));
                                                    const newMessage = { ...dataStepCopy.message, file: result, type: { typeMessage: result.type, toShow: false } }
                                                    const updateStep = { ...dataStepCopy, message: newMessage }
                                                    setDataStep(updateStep)
                                                }

                                            })
                                        }} type='circle-primary'>
                                        Enviar <i className='bx bx-arrow-from-bottom'></i>
                                    </ButtonModel> :
                                    <ButtonModel
                                        type='circle-secoundary'
                                        onClick={() => {
                                            var dataStepCopy = JSON.parse(JSON.stringify(dataStep));
                                            const newMessage = { ...dataStepCopy.message, file: null, type: { typeMessage: 'text', toShow: false } }
                                            const updateStep = { ...dataStepCopy, message: newMessage }
                                            setDataStep(updateStep)
                                            setStateFilesObject({ file: null, type: null })
                                        }}
                                    >
                                        Remover<i className='bx bx-x'></i>
                                    </ButtonModel> :
                                null
                        }
                    </div> :

                    excludeTypes.includes(dataStep?.type) ? null :
                        <InputCheckbox
                            disabled={disableTypes.includes(dataStep?.type) ? true : false}
                            onChange={(value) => {
                                var dataStepCopy = JSON.parse(JSON.stringify(dataStep));
                                if (!value) {
                                    dataStepCopy.message = null
                                }
                                if (value) {
                                    dataStepCopy.message = createMessage()
                                }
                                setDataStep(dataStepCopy)
                            }}
                            state={dataStep?.message ? true : false}
                            placeholder='Deseja enviar uma mensagem?'
                        />
            }
            {dataStep?.message && !excludeTypes.includes(dataStep?.type) ?
                <div className="inputs-for-message">
                    {TextAreaContition(dataStep, stateFilesObject) ?
                        <div>
                            <InputTextArea

                                value={dataStep?.message?.text}
                                onFocus={true}
                                rows={10}
                                columns={40}
                                id='inputTextCreateAssistant'
                                onChange={(value) => {
                                    var dataStepCopy = JSON.parse(JSON.stringify(dataStep));
                                    const newMessage = { ...dataStepCopy.message, text: value }
                                    const updateStep = { ...dataStepCopy, message: newMessage }
                                    setDataStep(updateStep)
                                }}
                                placeholder='Digite aqui sua mensagem...'
                            />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <EmojiComponent targetId={'inputTextCreateAssistant'} position='bottom-left' onChange={(value) => {
                                    var dataStepCopy = JSON.parse(JSON.stringify(dataStep));
                                    const newMessage = { ...dataStepCopy.message, text: value }
                                    const updateStep = { ...dataStepCopy, message: newMessage }
                                    setDataStep(updateStep)
                                }} />
                                <BubblesContainer
                                    id={'bubbles-container-assist'}
                                    position='bottom'
                                    data={dataBubbles}
                                    icon={{ icon: <i className='bx bx-paperclip bx-rotate-90' ></i> }} />

                            </div>
                            <div>
                                <input accept="image/*" className='file-hide' type="file" name="" id="file-image-assist" onChange={(event) => { showFileToUpload(event, 'image') }} />
                                <input accept="video/*" className='file-hide' type="file" name="" id="file-video-assist" onChange={(event) => { showFileToUpload(event, 'video') }} />
                                <input accept="application/*" className='file-hide' type="file" name="" id="file-document-assist" onChange={(event) => { showFileToUpload(event, 'document') }} />
                                <input accept="image/*" className='file-hide' type="file" name="" id="file-sticker-assist" onChange={(event) => { showFileToUpload(event, 'sticker') }} />
                                <input accept="audio/*, audio/ogg" className='file-hide' type="file" id="file-audio-assist" onChange={(event) => { showFileToUpload(event, 'audio') }} />
                            </div>
                        </div> : null}


                </div> : null
            }
            <div className="type">
                <div className="title">Ações</div>
                <div className="options">
                    <InputRounded >
                        <InputRoundedOptionChildren
                            balls
                            checked={dataStep?.type === 'simpleMessage' ? true : null}
                            name='typeStep'
                            value='simpleMessage'
                            onChange={(value) => {
                                updateTypeStep(value)
                            }} >
                            <div className="action-container">
                                <div className="content">
                                    <i className='bx bx-message' style={{ color: 'var(--blue-color)', border: '1px solid var(--blue-color)' }}></i>
                                    <div className="text">Mensagem Comum</div>
                                </div>
                            </div>
                        </InputRoundedOptionChildren>

                        {TextAreaContition(dataStep, stateFilesObject) ?
                            <InputRoundedOptionChildren
                                balls
                                checked={dataStep?.type === 'options' ? true : null}
                                name='typeStep'
                                value='options'
                                onChange={(value) => { updateTypeStep(value) }} >
                                <div className="action-container">
                                    <div className="content">
                                        <i className='bx bx-list-ul' style={{ color: 'var(--success-color)', border: '1px solid var(--success-color)' }}></i>
                                        <div className="text">Criar Opções</div>
                                    </div>
                                </div>
                            </InputRoundedOptionChildren> : null}
                        <InputRoundedOptionChildren
                            balls
                            checked={dataStep?.type === 'transfer' ? true : null}
                            name='typeStep'
                            value='transfer'
                            onChange={(value) => { updateTypeStep(value) }} >
                            <div className="action-container">
                                <div className="content">

                                    <i className='bx bx-support' style={{ color: 'var(--danger-color)', border: '1px solid var(--danger-color)' }}></i>
                                    <div className="text">Atendimento Humano</div>
                                </div>
                            </div>
                        </InputRoundedOptionChildren>
                        {TextAreaContition(dataStep, stateFilesObject) ?
                            <div>
                                <InputRoundedOptionChildren
                                    balls
                                    checked={dataStep?.type === 'input' ? true : null}
                                    name='typeStep'
                                    value='input'
                                    onChange={(value) => { updateTypeStep(value) }} >
                                    <div className="action-container">
                                        <div className="content" >
                                            <i className='bx bx-font' style={{ color: 'var(--violet-color)', border: '1px solid var(--violet-color)' }}></i>
                                            <div className="text">Capturar Informação de Texto</div>
                                        </div>
                                    </div>
                                </InputRoundedOptionChildren>
                                <InputRoundedOptionChildren
                                    balls
                                    checked={dataStep?.type === 'inputOptions' ? true : null}
                                    name='typeStep'
                                    value='inputOptions'
                                    onChange={(value) => { updateTypeStep(value) }} >
                                    <div className="action-container">
                                        <div className="content">
                                            <i className='bx bx-list-ol' style={{ color: 'var(--orange-color)', border: '1px solid var(--orange-color)' }}></i>
                                            <div className="text">Capturar Informação de Opções</div>
                                        </div>
                                    </div>
                                </InputRoundedOptionChildren>
                                <InputRoundedOptionChildren
                                    balls
                                    checked={dataStep?.type === 'sendRequest' ? true : null}
                                    name='typeStep'
                                    value='sendRequest'
                                    onChange={(value) => { updateTypeStep(value) }} >
                                    <div className="action-container">
                                        <div className="content">
                                            <i className='bx bx-send' style={{ color: 'var(--pink-color)', border: '1px solid var(--pink-color)' }}></i>
                                            <div className="text">Envia Requisição</div>
                                        </div>
                                    </div>
                                </InputRoundedOptionChildren>
                                <InputRoundedOptionChildren
                                    balls
                                    checked={dataStep?.type === 'survey' ? true : null}
                                    name='typeStep'
                                    value='survey'
                                    onChange={(value) => { updateTypeStep(value) }} >
                                    <div className="action-container">
                                        <div className="content">
                                            <i className='bx bx-question-mark' style={{ color: 'var(--warn-color)', border: '1px solid var(--warn-color)' }}></i>
                                            <div className="text">Fazer uma Pesquisa</div>
                                        </div>
                                    </div>
                                </InputRoundedOptionChildren>
                                <InputRoundedOptionChildren
                                    balls
                                    checked={dataStep?.type === 'bookmark' ? true : null}
                                    name='typeStep'
                                    value='bookmark'
                                    onChange={(value) => { updateTypeStep(value) }} >
                                    <div className="action-container">
                                        <div className="content">
                                            <i className='bx bxs-tag' style={{ color: 'var(--violet-color)', border: '1px solid var(--violet-color)' }}></i>
                                            <div className="text">Adicionar Marcador</div>
                                        </div>
                                    </div>
                                </InputRoundedOptionChildren>
                                <InputRoundedOptionChildren
                                    balls
                                    checked={dataStep?.type === 'removeBookmark' ? true : null}
                                    name='typeStep'
                                    value='removeBookmark'
                                    onChange={(value) => { updateTypeStep(value) }} >
                                    <div className="action-container">
                                        <div className="content">
                                            <i className='bx bxs-tag-x' style={{ color: 'var(--orange-color)', border: '1px solid var(--orange-color)' }}></i>
                                            <div className="text">Remover Marcador</div>
                                        </div>
                                    </div>
                                </InputRoundedOptionChildren>
                                {/* <InputRoundedOptionChildren
                                    balls
                                    checked={dataStep?.type === 'notificationWhatsapp' ? true : null}
                                    name='typeStep'
                                    value='notificationWhatsapp'
                                    onChange={(value) => { updateTypeStep(value) }} >
                                    <div className="action-container">
                                        <div className="content">
                                            <i className='bx bxl-whatsapp' style={{ color: 'var(--success-color)', border: '1px solid var(--success-color)' }}></i>
                                            <div className="text">Notificação por Whatsapp</div>
                                        </div>
                                    </div>
                                </InputRoundedOptionChildren>
                                <InputRoundedOptionChildren
                                    balls
                                    checked={dataStep?.type === 'modelDify' ? true : null}
                                    name='typeStep'
                                    value='modelDify'
                                    onChange={(value) => { updateTypeStep(value) }} >
                                    <div className="action-container">
                                        <div className="content">
                                            <i className='bx bxs-brain' style={{ color: 'var(--tree-color)', border: '1px solid var(--tree-color)' }}></i>
                                            <div className="text">Modelo de I.A.</div>
                                        </div>
                                    </div>
                                </InputRoundedOptionChildren> */}

                                <InputRoundedOptionChildren
                                    balls
                                    checked={dataStep?.type === 'otherAssistant' ? true : null}
                                    name='typeStep'
                                    value='otherAssistant'
                                    onChange={(value) => { updateTypeStep(value) }} >
                                    <div className="action-container">
                                        <div className="content">
                                            <i className='bx bxs-bot' style={{ color: 'var(--danger-color)', border: '1px solid var(--danger-color)' }}></i>
                                            <div className="text">Transferir para assistente</div>
                                        </div>
                                    </div>
                                </InputRoundedOptionChildren>
                                <InputRoundedOptionChildren
                                    balls
                                    checked={dataStep?.type === 'condition' ? true : null}
                                    name='typeStep'
                                    value='condition'
                                    onChange={(value) => { updateTypeStep(value) }} >
                                    <div className="action-container">
                                        <div className="content">
                                            <i className='bx bx-git-repo-forked' style={{ color: 'var(--pink-color)', border: '1px solid var(--pink-color)' }}></i>
                                            <div className="text">Condição</div>
                                        </div>
                                    </div>
                                </InputRoundedOptionChildren>

                            </div>
                            : null
                        }

                    </InputRounded>
                </div>
                <div className="model">
                    {
                        dataStep?.type ?
                            typeStepForCreate(
                                dataStep,
                                (options) => {
                                    var dataStepCopy = JSON.parse(JSON.stringify(dataStep))
                                    dataStepCopy.options = options
                                    setDataStep(dataStepCopy)
                                },
                                (negativeMessage) => {
                                    var dataStepCopy = JSON.parse(JSON.stringify(dataStep))
                                    dataStepCopy.negativeMessage.text = negativeMessage
                                    setDataStep(dataStepCopy)
                                },
                                (dataStep) => {
                                    setDataStep(dataStep)
                                }
                            ) :
                            null
                    }
                </div>
            </div>
        </div>
        <div className="is-end">
            {!['options', 'condition'].includes(dataStep?.type) ?
                <div>
                    <Button
                        status={dataStep?.isEnd}
                        onChange={(value) => {
                            var dataStepCopy = JSON.parse(JSON.stringify(dataStep));
                            if (dataStepCopy.type !== 'options') {
                                const updateStep = { ...dataStepCopy, isEnd: value }
                                setDataStep(updateStep)

                            } else {
                                toast.error('Uma mensagem do tipo opção não pode ser o fim da conversa.',
                                    {
                                        position: "top-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "colored",
                                    });
                            }
                        }}
                        placeholder='Essa mensagem é o fim da conversa?'
                        bold={true}
                    />
                </div> :
                null
            }
        </div>
        <div className="section-two" >
            <ButtonModel
                type='circle-secoundary'
                onClick={() => {
                    setCreateAreaData(null)
                }}
            >
                Cancelar
            </ButtonModel>
            <ButtonModel
                type='circle-primary'
                onClick={async () => {
                    var dataStepCopy = JSON.parse(JSON.stringify(dataStep))
                    var result = { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }
                    if (verifyIfOptionsValuesIsNull(dataStepCopy)) {
                        if (stateFilesObject?.file && !dataStepCopy.message.file) {
                            await uploadFile(stateFilesObject).then(async (result) => {
                                if (!result.error) {
                                    const newMessage = { ...dataStepCopy.message, file: result, type: { typeMessage: result.type, toShow: false } }
                                    const updateStep = { ...dataStepCopy, message: newMessage }
                                    dataStepCopy = updateStep
                                    setDataStep(dataStepCopy)
                                }

                            })
                        }
                        if (dataStepCopy.type === 'options') {
                            var nodeSteps = nodes.find(node => node.id === dataStepCopy.section)?.data?.sections
                            var hasOptionsStep = nodeSteps.reduce((acc, step) => {
                                if (step.type === 'options') { acc++ }
                                return acc
                            }, 0)
                            if (dataStepCopy.index < nodeSteps.length || hasOptionsStep > 1) {
                                toast.error(
                                    dataStepCopy.index < nodeSteps.length ?
                                        'Você pode adicionar mensagem do tipo OPÇÃO no final do bloco.' :
                                        'Você pode adicionar apenas uma única mensagem do tipo OPÇÃO por bloco.',
                                    {
                                        position: "top-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "colored",
                                    });
                            } else {
                                setCreateAreaData(null)
                                result.nodes = updateNodes(dataStepCopy, result.nodes)
                                result = addNodesChilds(dataStepCopy.id, dataStepCopy.section, dataStepCopy.options, result)
                                // console.log(result.nodes);
                            }
                        }
                        if (dataStepCopy.type === 'condition') {
                            var nodeSteps = nodes.find(node => node.id === dataStepCopy.section)?.data?.sections
                            var hasOptionsStep = nodeSteps.reduce((acc, step) => {
                                if (step.type === 'condition') { acc++ }
                                return acc
                            }, 0)
                            if (dataStepCopy.index < nodeSteps.length || hasOptionsStep > 1) {
                                toast.error(
                                    dataStepCopy.index < nodeSteps.length ?
                                        'Você pode adicionar mensagem do tipo CONDICIONAL no final do bloco.' :
                                        'Você pode adicionar apenas uma única mensagem do tipo CONDICIONAL por bloco.',
                                    {
                                        position: "top-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "colored",
                                    });
                            } else {
                                setCreateAreaData(null)
                                result.nodes = updateNodes(dataStepCopy, result.nodes)
                                result = addNodesChilds(dataStepCopy.id, dataStepCopy.section, [dataStepCopy.options[1], dataStepCopy.options[2]], result)
                            }

                        }
                        else {
                            result.nodes = updateNodes(dataStepCopy, result.nodes)
                            if (['options', 'condition'].includes(stateStepBefore.type) && !['options', 'condition'].includes(dataStepCopy.type)) {
                                console.log('cannot update');
                                result = deleteNodes(stateStepBefore.options.map(option => option.id), result.nodes, result.edges)
                            }



                        }
                        ApiBack.post(`assistant/nodes?id=${assistant?._id}`, result.nodes)
                        ApiBack.post(`assistant/edges?id=${assistant?._id}`, result.edges)
                        // console.log(result.nodes);
                        setNodes(result.nodes)
                        setEdges(result.edges)
                        setCreateAreaData(null)

                    } else {
                        toast.error('Por favor, verifique se você preencheu todos os campos necessários para a criação da mensagem.', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                    }


                }}
            >
                Salvar
            </ButtonModel>

        </div>

    </div >
}
function verifyIfOptionsValuesIsNull(dataStep) {
    const { type, options } = dataStep
    var result = true
    if (type === 'options' || type === 'inputOptions') {
        for (let index = 0; index < options.length; index++) {
            if (!options[index].value || !options[index].name) {
                result = false
            }
        }
    }
    if (type === 'input') {
        if (!options[0].name || !options[0].type) {
            result = false
        }
    }
    if (type === 'survey') {
        if (!options[0].options || options[0].options.length === 0 || !options[0].surveyId) {
            result = false
        }
    }
    if (type === 'notificationWhatsapp') {
        console.log(options[0]);
        if (!options[0].connectionId || !options[0].message || !options[0].phoneNumber || !options[0].areaCode) {
            result = false
        }
    }
    if (type === 'bookmark') {
        if (!options[0].bookmarkId) {
            result = false
        }
    }
    if (type === 'sendRequest') {
        if (!options[0].type || !options[0].url) {
            result = false
        }
    }
    return result
}

function TypeInputOptions({ data, updateOptions, setNegativeMessage }) {
    const [options, setOptions] = useState(null)
    const [anchorEmoji, setAnchorEmoji] = useState(null);
    const { nodes } = useContext(AppContext)
    const targetEmoji = (event) => {
        setAnchorEmoji(event)
    }
    useEffect(() => {
        if (data && verifyIsOption(data.options) && data.type === 'inputOptions') {
            setOptions(data.options)
        } else {
            var indexNode = nodes.findIndex(node => node.id === data.section)
            var node = nodes[indexNode]
            var sections = node.data.sections
            var indexStep = sections.findIndex(section => section.id === data.id)
            var previousStep = sections[indexStep - 1]
            if (!previousStep) {
                previousStep = null
            }
            var nextStep = sections[indexStep + 1]
            if (!nextStep) {
                nextStep = null
            }
            setOptions([
                {
                    id: uuidv4(),
                    name: null,
                    value: null,
                    index: 1,
                    options: null,
                    nextStep: nextStep?.id || null,
                    backStep: previousStep?.id || null,
                },
                {
                    id: uuidv4(),
                    name: null,
                    value: null,
                    index: 2,
                    options: null,
                    nextStep: nextStep?.id || null,
                    backStep: previousStep?.id || null,
                },
            ])
        }
    }, [data, nodes])

    function verifyIsOption(options) {
        if (
            options[0].hasOwnProperty('id') &&
            options[0].hasOwnProperty('name') &&
            options[0].hasOwnProperty('value') &&
            options[0].hasOwnProperty('options') &&
            options[0].hasOwnProperty('nextStep')
        ) {
            return true
        } else {
            return false
        }

    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Qual o nome desta informação?</div>
                <div className="content">
                    <InputText
                        value={options ? options[0]?.name : null}
                        onChange={(value) => {
                            const updateState = [...options]
                            const update = updateState?.map((option) => {
                                option.name = value
                                return option
                            })
                            setOptions(update)
                            updateOptions(update)
                        }} />
                </div>
                <div className="title">Quais opções você gostaria de mostrar?</div>
                <div className="content" >
                    {
                        options?.map((option) => {
                            return <Option
                                deleteState={options.length > 2 ? true : false}
                                key={option.id}
                                option={option}
                                onUpdate={(value) => {
                                    var update = [...options]
                                    update = update.map((option) => {
                                        if (option?.id === value?.id) {
                                            return value
                                        } else {
                                            return option
                                        }
                                    })
                                    setOptions(update)
                                    updateOptions(update)
                                }}
                                onDelete={id => {
                                    var filter = options?.filter(option => option.id !== id)
                                    filter = filter.map((option, index) => {
                                        option.index = index + 1
                                        return option
                                    })
                                    setOptions(filter)
                                    updateOptions(filter)
                                }}
                            />
                        })
                    }
                    <ButtonModel
                        type='circle-secoundary'
                        onClick={() => {
                            setOptions(oldOptions => [...oldOptions, {
                                id: uuidv4(),
                                name: options[0].name,
                                value: null,
                                index: options?.length + 1,
                                options: null,
                                nextStep: options[0].nextStep,
                                backStep: options[0].backStep
                            }])
                        }}
                    >
                        <i className='bx bx-plus'></i>
                    </ButtonModel>
                    <div className="title">Caso o usuário escolha uma opção inválida</div>
                    <div className="content" style={{ display: 'flex', alignItems: 'center' }} >
                        <EmojiComponent
                            targetId={'inputTextNegativeMessage'}
                            onChange={(value) => {
                                setNegativeMessage(value)
                            }}
                        />
                        <InputTextArea
                            value={data?.negativeMessage?.text}
                            rows={5}
                            columns={25}
                            id='inputTextNegativeMessage'
                            onChange={(value) => {
                                setNegativeMessage(value)
                            }}
                            placeholder='Digite aqui sua mensagem...'
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}

function TypeOptions({ data, updateOptions, setNegativeMessage }) {
    const [options, setOptions] = useState(null)
    const { nodes } = useContext(AppContext)
    const [anchorEmoji, setAnchorEmoji] = useState(null);
    const targetEmoji = (event) => {
        setAnchorEmoji(event)
    }

    useEffect(() => {
        if (data && verifyIsOption(data.options)) {
            setOptions(data.options)
        } else {
            var indexNode = nodes.findIndex(node => node.id === data.section)
            var previousStep
            if (nodes[indexNode]?.data.sections[nodes[indexNode].data.sections.findIndex(section => section.id === data.id) - 1]) {
                previousStep = nodes[indexNode].data.sections[nodes[indexNode].data.sections.findIndex(section => section.id === data.id) - 1]
            } else {
                previousStep = null
            }
            var idOne = uuidv4()
            var idTwo = uuidv4()
            setOptions([
                {
                    id: idOne,
                    name: null,
                    value: null,
                    index: 1,
                    options: null,
                    nextStep: idOne,
                    backStep: previousStep?.id || null,
                },
                {
                    id: idTwo,
                    name: null,
                    value: null,
                    index: 2,
                    options: null,
                    nextStep: idTwo,
                    backStep: previousStep?.id || null,
                },
            ])
            data.isEnd = false
        }
    }, [data, nodes])

    function verifyIsOption(options) {
        if (
            options[0].hasOwnProperty('id') &&
            options[0].hasOwnProperty('name') &&
            options[0].hasOwnProperty('value') &&
            options[0].hasOwnProperty('options') &&
            options[0].hasOwnProperty('nextStep')
        ) {
            return true
        } else {
            return false
        }

    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Qual o nome desta informação?</div>
                <div className="content">
                    <InputText
                        value={options ? options[0]?.name : null}
                        onChange={(value) => {
                            const updateState = JSON.parse(JSON.stringify(options))
                            const update = updateState?.map((option) => {
                                option.name = value
                                return option
                            })
                            setOptions(update)
                            updateOptions(update)
                        }} />
                </div>
                <div className="title">Quais opções você gostaria de mostrar?</div>
                <div className="content" >
                    {
                        options?.map((option) => {
                            return <Option
                                deleteState={options.length > 2 ? true : false}
                                key={option.id}
                                option={option}
                                onUpdate={(value) => {
                                    var update = [...options]
                                    update = update.map((option) => {
                                        if (option?.id === value?.id) {
                                            return value
                                        } else {
                                            return option
                                        }
                                    })
                                    setOptions(update)
                                    updateOptions(update)
                                }}
                                onDelete={id => {
                                    var filter = options?.filter(option => option.id !== id)
                                    filter = filter.map((option, index) => {
                                        option.index = index + 1
                                        return option
                                    })
                                    setOptions(filter)
                                    updateOptions(filter)
                                }}
                            />
                        })
                    }
                    <ButtonModel
                        type='circle-secoundary'
                        onClick={() => {
                            var thisId = uuidv4()
                            var indexNode = nodes.findIndex(node => node.id === data.section)
                            var previousStep
                            if (nodes[indexNode].data.sections[nodes[indexNode].data.sections.findIndex(section => section.id === data.id) - 1]) {
                                previousStep = nodes[indexNode].data.sections[nodes[indexNode].data.sections.findIndex(section => section.id === data.id) - 1]
                            } else {
                                previousStep = null
                            }
                            setOptions(oldOptions => [...oldOptions, {
                                id: thisId,
                                name: options[0].name,
                                value: null,
                                index: options?.length + 1,
                                options: null,
                                nextStep: thisId,
                                backStep: previousStep?.id || null
                            }])
                        }}
                    >
                        <i className='bx bx-plus'></i>
                    </ButtonModel>


                    <div className="title">Caso o usuário escolha uma opção inválida</div>
                    <div className="content" style={{ display: 'flex', alignItems: 'center' }} >
                        <EmojiComponent
                            targetId={'inputTextNegativeMessage'}
                            onChange={(value) => {
                                setNegativeMessage(value)
                            }}
                        />
                        <InputTextArea
                            value={data?.negativeMessage?.text}
                            rows={5}
                            columns={25}
                            id='inputTextNegativeMessage'
                            onChange={(value) => {
                                setNegativeMessage(value)
                            }}
                            placeholder='Digite aqui sua mensagem...'
                        />
                    </div>

                </div>
            </div>
        </div >
    )
}

function Option({ option, onDelete, onUpdate, deleteState, placeholderFirstInput, placeholderSecondInput }) {
    const [stateOption, setStateOption] = useState(null)
    useEffect(() => {
        setStateOption(option)
    }, [option])

    var styleContainer = {
        display: 'flex',
        alignItens: 'center',
        justifyContent: 'space-between',
    }
    var styleIndex = {
        padding: '.3rem',
        fontWeight: '500',
        fontSize: '12pt'
    }
    var styleText = {
        display: 'flex',
        alignItens: 'center',
        width: '100%'
    }

    return (
        <div className="option-container" style={styleContainer}>
            <div className="text" style={styleText}>
                <div className="index" style={styleIndex}>{stateOption?.index}.</div>
                <InputText
                    id={stateOption?.id + 'name'}
                    value={stateOption?.value}
                    placeholder={placeholderFirstInput || 'Título da opção'}
                    onChange={(value) => {
                        const update = { ...stateOption, value: value }
                        onUpdate(update)
                        //setStateOption(update)
                    }}
                />
                <InputText
                    id={stateOption?.id + 'wordKeys'}
                    value={stateOption?.options?.map((option) => {
                        return option
                    })}
                    placeholder={placeholderSecondInput || 'Palavras chaves'}
                    onChange={(value) => {
                        var stringValue = value.replace(/\s/g, '')
                        stringValue = stringValue.toLowerCase()
                        const update = { ...stateOption, options: stringValue.split(',') }
                        onUpdate(update)
                        //setStateOption(update)
                    }}
                />
            </div>
            <div className="buttons">
                {deleteState ?
                    <IconButton onClick={() => { onDelete(stateOption?.id) }} size='small' ><i className='bx bx-trash' ></i></IconButton> :
                    <IconButton size='small' disable={true}><i className='bx bx-trash' ></i></IconButton>
                }
            </div>
        </div>
    )
}

function TypeTransfer({ data, updateOptions }) {
    const [options, setOptions] = useState(null)
    const { sectorsList } = useContext(AppContext)
    useEffect(() => {
        if (data?.options && verifyIsTransfer(data?.options)) {
            data.isEnd = true
            setOptions(data.options)
        } else {
            if (data.options) {
                setOptions([{
                    sectorId: null,
                    nextStep: data.options[0].nextStep,
                    backStep: data.options[0].backStep,
                }])
            }
        }
    }, [data])

    function verifyIsTransfer(options) {
        if (options) {
            if (
                options[0].hasOwnProperty('sectorId') &&
                options[0].hasOwnProperty('nextStep') &&
                options[0].hasOwnProperty('backStep')
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Para qual setor você deseja tranferir?</div>
                <div className="content">
                    <InputRounded >
                        <InputRoundedOption
                            checked={options ? options[0]?.sectorId === null ? true : false : false}
                            name='sectorsTransfer'
                            value=''
                            label='Visível para todos.'
                            onChange={() => {
                                var update = JSON.parse(JSON.stringify(options))
                                update[0].sectorId = null
                                updateOptions(update)
                            }} />
                        {
                            sectorsList?.map((sector) => {
                                if (sector.name !== "Default") {
                                    return <InputRoundedOption
                                        checked={options ? options[0]?.sectorId === sector._id ? true : false : false}
                                        key={sector._id + 'sector'}
                                        name='sectorsTransfer'
                                        value={sector._id}
                                        label={sector.name}
                                        onChange={(value) => {
                                            var update = JSON.parse(JSON.stringify(options))
                                            update[0].sectorId = value
                                            updateOptions(update)
                                        }} />
                                } else {
                                    return <InputRoundedOption
                                        checked={options ? options[0]?.sectorId === sector._id ? true : false : false}
                                        key={sector._id + 'sector'}
                                        name='sectorsTransfer'
                                        value={sector._id}
                                        label={'Padrão'}
                                        onChange={(value) => {
                                            var update = JSON.parse(JSON.stringify(options))
                                            update[0].sectorId = value
                                            updateOptions(update)
                                        }} />
                                }
                            })
                        }
                    </InputRounded>
                </div>
            </div>
        </div>
    )
}
function TypeModelDify({ data, updateOptions }) {
    const [options, setOptions] = useState(null)
    const { sectorsList } = useContext(AppContext)
    useEffect(() => {
        if (data?.options && verifyIsTransfer(data?.options)) {
            setOptions(data.options)
        } else {
            if (data.options) {
                setOptions([{
                    url: null,
                    token: null,
                    nextStep: null,
                    backStep: null,
                }])
            }
        }
    }, [data])

    function verifyIsTransfer(options) {
        if (options) {
            if (
                options[0].hasOwnProperty('token') &&
                options[0].hasOwnProperty('url') &&
                options[0].hasOwnProperty('nextStep') &&
                options[0].hasOwnProperty('backStep')
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Adicione os dados do Modelo</div>
                <div className="content">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25rem'
                    }}>
                        <InputText value={options && options[0]?.url} placeholder={'URL da API'} onChange={(value) => {
                            var update = JSON.parse(JSON.stringify(options))
                            update[0].url = value
                            updateOptions(update)
                        }}></InputText>
                        <InputText value={options && options[0]?.token} placeholder={'Token da API'} onChange={(value) => {
                            var update = JSON.parse(JSON.stringify(options))
                            update[0].token = value
                            updateOptions(update)
                        }}></InputText>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TypeTransferOtherAssistant({ data, updateOptions }) {
    const [options, setOptions] = useState(null)
    const { assistants } = useContext(AppContext)
    useEffect(() => {
        if (data?.options && verifyIsTransfer(data?.options)) {
            data.isEnd = true
            setOptions(data.options)
        } else {
            if (data.options) {
                setOptions([{
                    assistantId: null,
                    nextStep: null,
                    backStep: data.options[0].backStep,
                }])
            }
        }
    }, [data])

    function verifyIsTransfer(options) {
        if (options) {
            if (
                options[0].hasOwnProperty('assistantId') &&
                options[0].hasOwnProperty('nextStep') &&
                options[0].hasOwnProperty('backStep')
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Para qual assistente deseja transferir?</div>
                <div className="content">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25rem'
                    }}>
                        <InputRounded style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                            {
                                assistants?.map((assistant) => {
                                    return <InputRoundedOption
                                        checked={options ? options[0]?.assistantId === assistant._id ? true : false : false}
                                        key={assistant._id + 'assiatantId'}
                                        name='sectorsTransfer'
                                        value={assistant._id}
                                        label={assistant.name}
                                        onChange={(value) => {
                                            var update = JSON.parse(JSON.stringify(options))
                                            update[0].assistantId = value
                                            updateOptions(update)
                                        }} />
                                })
                            }
                        </InputRounded>


                    </div>
                </div>
            </div>
        </div>
    )
}

function TypeBookmark({ data, updateOptions }) {
    const [options, setOptions] = useState(null)
    const { bookmarks } = useContext(AppContext)
    useEffect(() => {
        if (data?.options && verifyIsBookmark(data?.options)) {
            setOptions(data.options)
        } else {
            if (data.options) {
                setOptions([{
                    bookmarkId: [],
                    nextStep: data.options[0].nextStep,
                    backStep: data.options[0].backStep,
                }])
            }
        }
    }, [data])
    function verifyIsBookmark(options) {
        if (options) {
            if (
                options[0].hasOwnProperty('bookmarkId') &&
                options[0].hasOwnProperty('nextStep') &&
                options[0].hasOwnProperty('backStep')
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Escoha um ou mais marcadores:</div>
                <div className="content">
                    {options && bookmarks?.map((bookmark) => {
                        return (
                            <BookmarkForList
                                mode={true}
                                key={bookmark._id + 'bookmark-assistant'}
                                active={options[0]?.bookmarkId.findIndex(bookmarkId => bookmarkId === bookmark._id) > -1 ? true : false}
                                bookmark={bookmark}
                                onChange={(data) => {
                                    const { action, id } = data
                                    var update = JSON.parse(JSON.stringify(options))
                                    var indexBookmark = update[0]?.bookmarkId?.findIndex(bookmarkId => bookmarkId === id)
                                    console.log(indexBookmark);
                                    if (action && indexBookmark === -1) {
                                        update[0].bookmarkId.push(id)
                                    }

                                    if (!action && indexBookmark !== -1) {
                                        update[0].bookmarkId = update[0]?.bookmarkId?.filter(bookmark => bookmark !== id)
                                    }
                                    updateOptions(update)
                                }
                                } />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
function TypeRemoveBookmark({ data, updateOptions }) {
    const [options, setOptions] = useState(null)
    const { bookmarks } = useContext(AppContext)
    useEffect(() => {
        if (data?.options && verifyIsBookmark(data?.options)) {
            setOptions(data.options)
        } else {
            if (data.options) {
                setOptions([{
                    removedBookmarks: ['all'],
                    nextStep: data.options[0].nextStep,
                    backStep: data.options[0].backStep,
                }])
            }
        }
    }, [data])
    function verifyIsBookmark(options) {
        if (options) {
            if (
                options[0].hasOwnProperty('removedBookmarks') &&
                options[0].hasOwnProperty('nextStep') &&
                options[0].hasOwnProperty('backStep')
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Escoha um ou mais marcadores para remover:</div>
                <div className="content">
                    <BookmarkForListMessageArea
                        key={'all-bookmark-assistant-remove'}
                        active={options ? options[0]?.removedBookmarks.findIndex(bookmarkId => bookmarkId === 'all') > -1 ? true : false : false}
                        bookmark={{
                            _id: 'all',
                            name: "Todos os marcadores",
                            color: "#1C1C33",
                            textColor: "#ffffff"
                        }}
                        onChange={(data) => {
                            const { action, id } = data
                            var update = JSON.parse(JSON.stringify(options))
                            var indexBookmark = update[0]?.removedBookmarks?.findIndex(bookmarkId => bookmarkId === id)
                            if (action && indexBookmark === -1) {
                                update[0].removedBookmarks = [id]
                            }

                            if (!action && indexBookmark !== -1) {
                                update[0].removedBookmarks = []
                            }
                            updateOptions(update)
                        }
                        } />
                    {options && bookmarks?.map((bookmark) => {
                        return (
                            <BookmarkForListMessageArea
                                key={bookmark._id + 'bookmark-assistant-remove'}
                                active={options[0]?.removedBookmarks.findIndex(bookmarkId => bookmarkId === bookmark._id) > -1 ? true : false}
                                bookmark={bookmark}
                                onChange={(data) => {
                                    const { action, id } = data
                                    var update = JSON.parse(JSON.stringify(options))
                                    var indexBookmark = update[0]?.removedBookmarks?.findIndex(bookmarkId => bookmarkId === id)
                                    var indexAllBookmark = update[0]?.removedBookmarks?.findIndex(bookmarkId => bookmarkId === 'all')
                                    if (indexAllBookmark > -1) {
                                        update[0].removedBookmarks = []
                                    }
                                    if (action && indexBookmark === -1) {
                                        update[0].removedBookmarks.push(id)
                                    }

                                    if (!action && indexBookmark !== -1) {
                                        update[0].removedBookmarks = update[0]?.removedBookmarks?.filter(bookmark => bookmark !== id)
                                    }
                                    updateOptions(update)
                                }
                                } />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
function TypeInput({ data, updateOptions }) {
    const [options, setOptions] = useState(null)
    const [dataOptionsSelect, setDataOptionsSelect] = useState(null)
    useEffect(() => {
        var dataSelect = [
            { name: `Nome`, value: 'name', selected: false },
            { name: `Número`, value: 'number', selected: false },
            { name: `Telefone`, value: 'phone', selected: false },
            { name: `Data`, value: 'date', selected: false },
            { name: `Hora`, value: 'hour', selected: false },
            { name: `CPF`, value: 'cpf', selected: false },
            { name: `Endereço`, value: 'adress', selected: false },
            { name: `CEP`, value: 'cep', selected: false },
            { name: `E-mail`, value: 'mail', selected: false },
            { name: `Texto`, value: 'custom', selected: false },
        ]
        if (data && verifyIsInput(data.options)) {
            dataSelect = dataSelect.map((option) => {
                var dataCopy = JSON.parse(JSON.stringify(data.options[0]))
                return option.value === dataCopy?.type ? { ...option, selected: true } : { ...option, selected: false }
            })
            setDataOptionsSelect(dataSelect)
            setOptions(data.options)
        } else {
            if (data.options) {
                setOptions([{
                    name: null,
                    type: null,
                    value: null,
                    nextStep: data.options[0].nextStep,
                    backStep: data.options[0].backStep,
                }])

            }
            setDataOptionsSelect(dataSelect)
        }
    }, [data])
    function verifyIsInput(options) {
        if (options) {
            if (
                options[0].hasOwnProperty('name') &&
                options[0].hasOwnProperty('type') &&
                options[0].hasOwnProperty('value') &&
                options[0].hasOwnProperty('nextStep') &&
                options[0].hasOwnProperty('backStep')
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Qual informação você deseja capturar?</div>
                <div className="content" style={{ display: 'flex', alignItens: 'center' }}>
                    <InputSelect
                        onChange={(value) => {
                            const update = JSON.parse(JSON.stringify(options))
                            update[0].type = value
                            //setOptions(update)
                            updateOptions(update)
                        }}
                        data={dataOptionsSelect} placeholder='Tipo' />
                    <InputText
                        value={options ? options[0]?.name : ''}
                        onChange={(value) => {
                            const update = JSON.parse(JSON.stringify(options))
                            update[0].name = value
                            // setOptions(update)
                            updateOptions(update)
                        }}
                        placeholder='Digite o nome da informação'
                    />
                </div>
            </div>
        </div>
    )
}

function TypeSendRequest({ data, updateOptions }) {
    const [options, setOptions] = useState(null)
    const [bodyState, setBodyState] = useState(false)
    const [tokenState, setTokenState] = useState(false)
    const [dataOptionsSelect, setDataOptionsSelect] = useState(null)
    useEffect(() => {

        var dataSelect = [
            { name: `GET`, value: 'get', selected: false },
            { name: `POST`, value: 'post', selected: false },
            { name: `DELETE`, value: 'del', selected: false },
            { name: `PUT`, value: 'put', selected: false }
        ]
        if (data && verifyIsRequest(data.options)) {
            if (data?.options[0]?.body) { setBodyState(true) }
            if (data?.options[0]?.token) { setTokenState(true) }
            dataSelect = dataSelect.map((option) => {
                var dataCopy = JSON.parse(JSON.stringify(data.options[0]))
                return option.value === dataCopy?.type ? { ...option, selected: true } : { ...option, selected: false }
            })
            setDataOptionsSelect(dataSelect)
            setOptions(data.options)
        } else {
            if (data.options) {
                var value = [{
                    type: 'get',
                    body: `{\n \ "data":"value",\n \ "data2":"value2"\n}`,
                    url: null,
                    dataGetRequest: { name: null, value: null, status: null },
                    token: null,
                    prefix: 'Authorization: Bearer ',
                    nextStep: data.options[0].nextStep,
                    backStep: data.options[0].backStep,
                }]
                setOptions(value)
                updateOptions(value)
                dataSelect[0].selected = true
                setDataOptionsSelect(dataSelect)
            }
        }
    }, [data])
    function verifyIsRequest(options) {
        if (options) {
            if (
                options[0].hasOwnProperty('url') &&
                options[0].hasOwnProperty('body') &&
                options[0].hasOwnProperty('type') &&
                options[0].hasOwnProperty('dataGetRequest') &&
                options[0].hasOwnProperty('token') &&
                options[0].hasOwnProperty('prefix') &&
                options[0].hasOwnProperty('nextStep') &&
                options[0].hasOwnProperty('backStep')
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Configure a sua requisição</div>
                <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItens: 'center' }}>
                    <div className="type-and-url" style={{ display: 'flex', alignItens: 'center' }}>
                        <InputSelect
                            placeholder="Tipo"
                            data={dataOptionsSelect}
                            onChange={(value) => {
                                const update = JSON.parse(JSON.stringify(options))
                                update[0].type = value
                                updateOptions(update)
                            }} />
                        <InputText
                            placeholder={'https://suaapi.com/'}
                            value={options ? options[0]?.url : null}
                            onChange={(value) => {
                                const updateState = JSON.parse(JSON.stringify(options))
                                updateState[0].url = value
                                updateOptions(updateState)
                            }} />
                    </div>
                    <Space />
                    <div>
                        <div className="title">Como quer chamar a informação?</div>
                        <InputText
                            placeholder={'Nome da variável com a resposta da requisição'}
                            value={options && options[0]?.dataGetRequest?.name ? options[0]?.dataGetRequest?.name : null}
                            onChange={(value) => {
                                const updateState = JSON.parse(JSON.stringify(options))
                                updateState[0].dataGetRequest['name'] = value
                                updateOptions(updateState)
                            }} />
                        <Space />
                    </div>
                    <InputCheckbox
                        disabled={options && ['del', 'get'].includes(options[0]?.type) ? true : false}
                        onChange={(value) => { setBodyState(value) }}
                        state={bodyState ? true : false}
                        placeholder='Enviar o corpo da requisição?'
                    />
                    <Space />
                    {
                        bodyState && !['del', 'get'].includes(options[0]?.type) ?
                            <CodeEditor
                                minHeight={50}
                                value={options ? options[0]?.body : `{\n \ "data":"value",\n \ "data2":"value2"\n}`}
                                language="json"
                                placeholder={`\n Digite o corpo da requisição no tipo JSON como no exemplo abaxo: \n {\n \ "data":"value",\n \ "data2":"value2"\n}`}
                                onChange={(evn) => {
                                    const update = JSON.parse(JSON.stringify(options))
                                    update[0].body = evn.target.value
                                    updateOptions(update)
                                }}
                                padding={15}
                                style={{
                                    width: '25rem',
                                    fontSize: 12,
                                    backgroundColor: "var(--one-color)",
                                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                }}
                            /> : null
                    }
                    <Space />
                    <InputCheckbox
                        onChange={(value) => { setTokenState(value) }}
                        state={tokenState ? true : false}
                        placeholder='Auth ou Token?'
                    />
                    {
                        tokenState ?
                            <div>
                                <InputText
                                    placeholder={'Token'}
                                    value={options ? options[0]?.token : null}
                                    onChange={(value) => {
                                        const updateState = JSON.parse(JSON.stringify(options))
                                        updateState[0].token = value
                                        updateOptions(updateState)
                                    }} />
                                <InputText
                                    placeholder={'Prefixo do token'}
                                    value={options ? options[0]?.prefix : 'Authorization: Bearer '}
                                    onChange={(value) => {
                                        const updateState = JSON.parse(JSON.stringify(options))
                                        updateState[0].prefix = value
                                        updateOptions(updateState)
                                    }} />
                            </div> :
                            null
                    }
                </div>
            </div>
        </div>
    )
}

function TypeNotificationWhatsapp({ data, updateOptions }) {
    const [stateFilesObject, setStateFilesObject] = useState(null)
    const [anchorEmoji, setAnchorEmoji] = useState(null);
    const targetEmoji = (event) => {
        setAnchorEmoji(event)
    }
    const dataBubbles = [
        {
            icon: <i className='bx bx-image' ></i>,
            name: 'Imagem',
            action: () => { click('file-image-assist-notification') },
            color: '#F55064'
        },
        {
            icon: <i className='bx bx-video' ></i>,
            name: 'Video',
            action: () => { click('file-video-assist-notification') },
            color: '#ff9800'
        },
        {
            icon: <i className='bx bx-music' ></i>,
            name: 'Audio',
            action: () => { click('file-audio-assist-notification') },
            color: '#d22929'
        },
        {
            icon: <i className='bx bx-file'></i>,
            name: 'Documento',
            action: () => { click('file-document-assist-notification') },
            color: '#4caf50'
        }/* ,
        {
            icon: <i className='bx bx-sticker' ></i>,
            name: 'Sticker',
            action: () => { click('file-sticker-assist-notification') },
            color: '#9c27b0'
        } */
    ]
    const [options, setOptions] = useState(null)
    const [dataOptionsConections, setDataOptionsSelect] = useState(null)

    useEffect(async () => {

        if (data && verifyIsNotificationWhatsapp(data?.options)) {
            setOptions(data.options)
        } else {
            if (data.options) {
                setOptions([{
                    phoneNumber: null,
                    areaCode: '+55',
                    message: createMessage('', null),
                    connectionId: null,
                    nextStep: data?.options[0]?.nextStep,
                    backStep: data?.options[0]?.backStep,
                }])
            }
        }
    }, [data])
    function verifyIsNotificationWhatsapp(options) {
        if (options) {
            if (
                options[0].hasOwnProperty('phoneNumber') &&
                options[0].hasOwnProperty('message') &&
                options[0].hasOwnProperty('areaCode') &&
                options[0].hasOwnProperty('connectionId') &&
                options[0].hasOwnProperty('nextStep') &&
                options[0].hasOwnProperty('backStep')
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    async function convertToWebp(file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => (img.onload = resolve));
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const blob = await new Promise((resolve) =>
            canvas.toBlob((blob) => resolve(blob), 'image/webp')
        );
        return new File([blob], file.name.substring(0, file.name.indexOf('.')) + '.webp', { type: 'image/webp' });
    }
    async function uploadFile(element) {
        var type = element?.type
        var file = type === 'sticker' ? await convertToWebp(element?.file?.target?.files[0]) : element?.file?.target?.files[0]
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file?.name);
        formData.append('typeUpload', type);
        var index = file?.type?.indexOf('/')
        var responseData
        await ApiBack.post('connection/uploadFile', formData)
            .then((response) => {
                responseData = response.data
            }).catch((err) => {
                responseData = err.response.data
                toast.error(err.response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            })
        responseData.name = file?.name
        responseData.extension = file.type.substring(index + 1, file.type.length)
        return responseData
    }

    function click(id) {
        document.getElementById(id).click();
    }

    function showFileToUpload(e, type) {
        setStateFilesObject({ type: type, file: e })
    }
    function phoneMask(event) {
        var value = event.target.value;
        var returnValue = value.replace(/\D/g, "");
        returnValue = returnValue.replace(/^0/, "");
        if (returnValue.length > 10) {
            returnValue = returnValue.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (returnValue.length > 5) {
            if (returnValue?.length === 6 /* && event?.code === "Backspace" */) {
                // necessário pois senão o "-" fica sempre voltando ao dar backspace
                return;
            }
            returnValue = returnValue.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (returnValue.length > 2) {
            returnValue = returnValue.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
        } else {
            if (returnValue.length !== 0) {
                returnValue = returnValue.replace(/^(\d*)/, "($1");
            }
        }
        document.getElementById(event.target.id).attributes[0].ownerElement['value'] = returnValue;
        return returnValue;
    }
    function generateDdiCode() {
        var elements = []
        for (let index = 1; index < 999; index++) {
            if (index === 55) {
                elements.push({ name: `+${index}`, value: index, selected: true })
            } else {
                elements.push({ name: `+${index}`, value: index })
            }

        }
        return elements
    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Com qual conexão você deseja enviar a notificação?</div>
                <InputRounded >
                    {
                        dataOptionsConections?.map((connection) => {
                            return <InputRoundedOption
                                checked={options ? options[0]?.connectionId === connection.id : false}
                                key={connection.id + 'assistant'}
                                name='connectionsAssistant'
                                value={connection.id}
                                label={connection.name}
                                onChange={(value) => {
                                    const update = JSON.parse(JSON.stringify(options))
                                    update[0].connectionId = value
                                    updateOptions(update)
                                }} />
                        })
                    }
                </InputRounded>
                <div className="title">Qual o número do Whatsapp?</div>
                <div style={{ width: '92%', display: 'flex', alignItens: 'center' }}>
                    <InputSelect
                        id='ddiValue'
                        data={generateDdiCode()}
                        defaultValue={options && options[0]?.areaCode ? options[0]?.areaCode : null}
                        placeholder='País'
                        onChange={(e) => {
                            var update = JSON.parse(JSON.stringify(options));
                            update[0].areaCode = e
                            updateOptions(update)
                        }}
                    />
                    <InputText
                        value={options && options[0]?.phoneNumber ? options[0]?.phoneNumber : ''}
                        id="phoneNumberNotification"
                        placeholder='(00) 00000-0000'
                        event={(event) => {
                            var update = JSON.parse(JSON.stringify(options));
                            update[0].phoneNumber = phoneMask(event)
                            updateOptions(update)
                        }}
                    />
                </div>
                <div className="title">Escreva sua mensagem</div>
                <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItens: 'center' }}>
                    {
                        options && options[0]?.message?.file || stateFilesObject ?
                            <div className="file-preview">
                                <div className="head">
                                    <IconButton onClick={() => {
                                        var update = JSON.parse(JSON.stringify(options));
                                        update[0].message = {
                                            ...update[0].message,
                                            file: null,
                                            type: { typeMessage: 'text', toShow: false }
                                        }
                                        updateOptions(update)
                                        setStateFilesObject(null)
                                    }}
                                    >
                                        <i className='bx bx-x'></i>
                                    </IconButton>
                                </div>
                                <FilesPreview file={options && options[0]?.message?.file ? options[0]?.message?.file : stateFilesObject} onlyShow={options && options[0]?.message?.file ? true : false} />
                                {
                                    options && options[0]?.message?.file || stateFilesObject ?
                                        options && !options[0]?.message?.file ?
                                            <ButtonModel
                                                onClick={() => {
                                                    uploadFile(stateFilesObject).then((result) => {
                                                        if (!result.error) {
                                                            var update = JSON.parse(JSON.stringify(options));
                                                            update[0].message = {
                                                                ...update[0].message,
                                                                file: result,
                                                                type: { typeMessage: result.type, toShow: false }
                                                            }
                                                            updateOptions(update)
                                                        }

                                                    })
                                                }} type='circle-primary'>
                                                Enviar <i className='bx bx-arrow-from-bottom'></i>
                                            </ButtonModel> :
                                            <ButtonModel
                                                type='circle-secoundary'
                                                onClick={() => {
                                                    var update = JSON.parse(JSON.stringify(options));
                                                    update[0].message = {
                                                        ...update[0].message, //copia o objeto para não alterar o objeto original
                                                        file: null, //remove o arquivo
                                                        type: { typeMessage: 'text', toShow: false } //muda o tipo
                                                    }
                                                    updateOptions(update)
                                                }}
                                            >
                                                Remover<i className='bx bx-x'></i>
                                            </ButtonModel> :
                                        null
                                }
                            </div> :

                            null
                    }

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} className="inputs-for-message">
                        <InputTextArea
                            value={options ? options[0]?.message?.text : ''}
                            onFocus={true}
                            rows={10}
                            columns={40}
                            id='inputTextCreateAssistant'
                            onChange={(value) => {
                                var update = JSON.parse(JSON.stringify(options));
                                update[0].message = { ...update[0].message, text: value }
                                updateOptions(update)
                            }}
                            placeholder='Digite aqui sua mensagem...'
                        />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <BubblesContainer
                                id={'bubbles-container-assist'}
                                data={dataBubbles}
                                icon={{ icon: <i className='bx bx-paperclip bx-rotate-90' ></i> }} />
                            <EmojiComponent
                                targetId={'inputTextCreateAssistant'}
                                onChange={(value) => {
                                    var update = JSON.parse(JSON.stringify(options));
                                    update[0].message = { ...update[0].message, text: value }
                                    updateOptions(update)
                                }}
                            />
                        </div>
                        <div >
                            <input accept="image/*" className='file-hide' type="file" name="" id="file-image-assist-notification" onChange={(event) => { showFileToUpload(event, 'image') }} />
                            <input accept="video/*" className='file-hide' type="file" name="" id="file-video-assist-notification" onChange={(event) => { showFileToUpload(event, 'video') }} />
                            <input accept="application/*" className='file-hide' type="file" name="" id="file-document-assist-notification" onChange={(event) => { showFileToUpload(event, 'document') }} />
                            <input accept="image/*" className='file-hide' type="file" name="" id="file-sticker-assist-notification" onChange={(event) => { showFileToUpload(event, 'sticker') }} />
                            <input accept="audio/*, audio/ogg" className='file-hide' type="file" id="file-audio-assist-notification" onChange={(event) => { showFileToUpload(event, 'audio') }} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
function TypeSurvey({ data, updateOptions }) {
    const [options, setOptions] = useState(null)
    const [editSurveyDialog, setEditSurveyDialog] = useState(false)
    const [deleteSurveyDialog, setDeleteSurveyDialog] = useState(false)
    const [deleteSurveyData, setDeleteSurveyData] = useState(null)
    const [editSurveyData, setEditSurveyData] = useState(null)
    const [createSurveyDialog, setCreateSurveyDialog] = useState(false)
    const [createSurveyData, setCreateSurveyData] = useState(null)
    const [surveySelected, setSurveySelected] = useState(null)
    const [surveys, setSurveys] = useState(null)

    useEffect(() => {
        async function fetchData(data) {
            const resultSurveys = await ApiBack.get('assistant/allSurveys')
            setSurveys(resultSurveys.data)
            if (data && verifyIsSurvey(data.options)) {
                setOptions(data.options)
                setSurveySelected(data.options[0]?.surveyId)
            } else {
                if (data.options) {
                    var value = [{
                        surveyId: null,
                        options: [],
                        nextStep: data.options[0].nextStep,
                        backStep: data.options[0].backStep,
                    }]
                    setOptions(value)
                    updateOptions(value)
                }
            }
        }
        fetchData(data)
    }, [data])

    function verifyIsSurvey(options) {
        if (options) {
            if (
                options[0].hasOwnProperty('surveyId') &&
                options[0].hasOwnProperty('options') &&
                options[0].hasOwnProperty('nextStep') &&
                options[0].hasOwnProperty('backStep')
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    function verifyNullValues(options, toast) {
        for (let index = 0; index < options.length; index++) {
            if (!options[index].value || !options[index].name) {
                toast.error('Por favor, preencha todos os campos.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                return false
            }
        }
        return true
    }
    async function createSurvey(toast) {
        var createSurveyDataCopy = JSON.parse(JSON.stringify(createSurveyData))
        var surveysCopy = JSON.parse(JSON.stringify(surveys))
        if (verifyNullValues(createSurveyDataCopy.data.options, toast)) {
            const resultSurveys = await ApiBack.post('assistant/survey', createSurveyDataCopy)
            surveysCopy.push(resultSurveys.data)
            setSurveys(surveysCopy)
            setCreateSurveyData(false)
            setCreateSurveyDialog(null)
        }
    }
    async function editSurvey(toast) {
        var editSurveyDataCopy = JSON.parse(JSON.stringify(editSurveyData))
        var surveysCopy = JSON.parse(JSON.stringify(surveys))
        var index = surveysCopy.findIndex(survey => survey._id === editSurveyDataCopy._id)
        if (verifyNullValues(editSurveyDataCopy.data.options, toast)) {
            const resultSurveys = await ApiBack.put('assistant/survey', editSurveyDataCopy)
            surveysCopy[index] = resultSurveys.data
            //rota de salvar edição
            if (surveySelected === surveysCopy[index]._id) {
                var optionsCopy = JSON.parse(JSON.stringify(options))
                optionsCopy[0].surveyId = surveySelected
                optionsCopy[0].options = editSurveyDataCopy.data?.options
                updateOptions(optionsCopy)
            }
            setSurveys(surveysCopy)
            setEditSurveyDialog(false)
            setEditSurveyData(null)
        }
    }
    async function deleteSurvey() {
        if (deleteSurveyData) {
            //regra de exclusão
            const resultSurveys = await ApiBack.delete(`assistant/survey?id=${deleteSurveyData._id}`)
            setSurveys(JSON.parse(JSON.stringify(resultSurveys.data)))
            setDeleteSurveyData(null)
        }
    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Qual pesquisa você gostaria que seja respondida?</div>
                <DialogBoxChildren open={editSurveyDialog} onClose={() => { setEditSurveyDialog(false); setEditSurveyData(null) }}>
                    <div className="title" style={{ maxWidth: '18rem' }}>
                        <InputText
                            style={'clean'}
                            onFocus={true}
                            placeholder={'Nome da sua pesquisa'}
                            onEnter={() => {
                                editSurvey(toast)
                            }}
                            value={editSurveyData?.name}
                            onChange={(value) => { setEditSurveyData({ ...editSurveyData, name: value }) }}
                        />
                    </div>
                    <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItens: 'center', width: '20rem' }}>
                        <div>
                            {editSurveyData?.data?.options?.map((option, index) => {
                                return <OptionSurvey
                                    key={option.id}
                                    deleteState={editSurveyData?.data?.options.length > 2
                                        ? true : false
                                    }
                                    option={option}
                                    index={index}
                                    onUpdate={(value) => {
                                        var editSurveyDataCopy = JSON.parse(JSON.stringify(editSurveyData))
                                        const index = editSurveyDataCopy.data.options.findIndex(option => option.id === value.id)
                                        editSurveyDataCopy.data.options[index] = value
                                        setEditSurveyData(editSurveyDataCopy)
                                    }}
                                    onDelete={id => {
                                        var editSurveyDataCopy = JSON.parse(JSON.stringify(editSurveyData))
                                        editSurveyDataCopy.data.options = editSurveyDataCopy.data.options?.filter(option => option.id !== id)
                                        setEditSurveyData(editSurveyDataCopy)
                                    }}
                                />
                            })}
                            <ButtonModel
                                type='circle-secoundary'
                                onClick={() => {
                                    var thisId = uuidv4()
                                    var editSurveyDataCopy = JSON.parse(JSON.stringify(editSurveyData))
                                    editSurveyDataCopy.data.options.push({
                                        id: thisId,
                                        name: '',
                                        value: null
                                    })
                                    setEditSurveyData(editSurveyDataCopy)
                                }}
                            >
                                <i className='bx bx-plus'></i>
                            </ButtonModel>

                            <Space />
                            <Bar></Bar>
                            <Space />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                                <SecoundaryButton onChange={() => { setEditSurveyDialog(false); setEditSurveyData(null) }}>Cancelar</SecoundaryButton>
                                <PrimaryButton onChange={() => {
                                    editSurvey(toast)
                                }}>
                                    Salvar
                                </PrimaryButton>
                            </div>
                        </div>

                    </div>
                </DialogBoxChildren>
                <DialogBoxChildren open={createSurveyDialog} onClose={() => { setCreateSurveyDialog(false) }}>
                    <div className="title" style={{ maxWidth: '18rem' }}>
                        <InputText
                            style={'clean'}
                            onFocus={true}
                            placeholder={'Nome da sua pesquisa'}
                            onEnter={() => {
                                createSurvey(toast)
                            }}
                            value={createSurveyData?.name}
                            onChange={(value) => { setCreateSurveyData({ ...createSurveyData, name: value }) }}
                        />
                    </div>
                    <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItens: 'center', width: '20rem' }}>
                        <div>
                            {createSurveyData?.data?.options?.map((option, index) => {
                                return <OptionSurvey
                                    key={option.id}
                                    deleteState={createSurveyData?.data?.options.length > 2
                                        ? true : false
                                    }
                                    option={option}
                                    index={index}
                                    onUpdate={(value) => {
                                        var createSurveyDataCopy = JSON.parse(JSON.stringify(createSurveyData))
                                        const index = createSurveyDataCopy.data.options.findIndex(option => option.id === value.id)
                                        createSurveyDataCopy.data.options[index] = value
                                        setCreateSurveyData(createSurveyDataCopy)
                                    }}
                                    onDelete={id => {
                                        var createSurveyDataCopy = JSON.parse(JSON.stringify(createSurveyData))
                                        createSurveyDataCopy.data.options = createSurveyDataCopy.data.options?.filter(option => option.id !== id)
                                        setCreateSurveyData(createSurveyDataCopy)
                                    }}
                                />
                            })}
                            <ButtonModel
                                type='circle-secoundary'
                                onClick={() => {
                                    var thisId = uuidv4()
                                    var createSurveyDataCopy = JSON.parse(JSON.stringify(createSurveyData))
                                    createSurveyDataCopy.data.options.push({
                                        id: thisId,
                                        name: '',
                                        value: null
                                    })
                                    setCreateSurveyData(createSurveyDataCopy)
                                }}
                            >
                                <i className='bx bx-plus'></i>
                            </ButtonModel>

                            <Space />
                            <Bar></Bar>
                            <Space />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                                <SecoundaryButton onChange={() => { setCreateSurveyDialog(false); setCreateSurveyData(null) }}>Cancelar</SecoundaryButton>
                                <PrimaryButton onChange={() => {
                                    createSurvey(toast)
                                }}>
                                    Criar
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </DialogBoxChildren>
                <DialogBox
                    open={deleteSurveyDialog}
                    onClose={() => { setDeleteSurveyDialog(false) }}
                    text={
                        <div>
                            Você tem certeza que deseja excluir essa pesquisa? <b style={{ color: 'var(--danger-color)' }}>TODOS OS DADOS serão perdidos e não poderão ser recuperados.</b> <br />
                            <span style={{ fontSize: '9pt', fontStyle: 'italic', fontWeight: '400', opacity: 0.5 }}>
                                Todas as mensagens de assistente vinculados a esta pesquisa serão mudados para o tipo "Mensagem Comum".
                            </span>
                        </div>
                    }
                    buttonOneText='Excluir'
                    buttonTwoText='Cancelar'
                    onButtonOne={() => {
                        deleteSurvey()
                        setDeleteSurveyDialog(false)
                    }}
                    onButtonTwo={() => {
                        setDeleteSurveyDialog(false)
                        setDeleteSurveyData(null)
                    }}
                >

                </DialogBox>
                <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItens: 'center' }}>
                    <InputRounded>
                        {surveys?.length > 0 ?
                            surveys?.map((survey) => {
                                return <InputRoundedOptionChildren
                                    key={survey._id}
                                    name='survey-option'
                                    value={survey._id}
                                    onChange={(value) => {
                                        setSurveySelected(value)
                                        var update = JSON.parse(JSON.stringify(options))
                                        update[0] = {
                                            ...update[0], surveyId: value, options: surveys?.find(survey => survey._id === value)?.data?.options
                                        }
                                        setOptions(update)
                                        updateOptions(update)
                                    }}
                                    checked={surveySelected === survey._id}

                                >
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', justifyContent: 'space-between', width: '20rem' }}>
                                        <span style={{ fontWeight: 'bold' }} > {survey.name}</span>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton onClick={() => { setEditSurveyDialog(true); setEditSurveyData(survey) }} size={'small'}><i className='bx bxs-pencil' ></i></IconButton>
                                            <IconButton onClick={() => { setDeleteSurveyDialog(true); setDeleteSurveyData(survey) }} size={'small'}><i className='bx bxs-trash' ></i></IconButton>
                                        </div>
                                    </div>

                                </InputRoundedOptionChildren>
                            })
                            :
                            <div style={{ margin: '1rem', fontSize: '9pt', fontStyle: 'italic', fontWeight: '400', opacity: 0.5 }}>Você ainda não possui nenhuma pesquisa criada.</div>
                        }
                        <ButtonModel
                            type='circle-secoundary'
                            onClick={() => {
                                setCreateSurveyDialog(true)
                                setCreateSurveyData({
                                    name: '',
                                    data: {
                                        votes: [],
                                        options: [
                                            {
                                                id: uuidv4(),
                                                name: '',
                                                value: null
                                            },
                                            {
                                                id: uuidv4(),
                                                name: '',
                                                value: null
                                            }
                                        ]
                                    }
                                })
                            }}
                        >
                            Criar nova pesquisa <i className='bx bx-plus'></i>
                        </ButtonModel>
                    </InputRounded>
                </div>

            </div>
        </div >
    )
}
function OptionSurvey({ option, onDelete, onUpdate, deleteState, index }) {
    const [stateOption, setStateOption] = useState(null)
    useEffect(() => {
        setStateOption(option)
    }, [option])

    var styleContainer = {
        display: 'flex',
        alignItens: 'center',
        justifyContent: 'space-between',
    }
    var styleIndex = {
        padding: '.3rem',
        fontWeight: '500',
        fontSize: '12pt'
    }
    var styleText = {
        display: 'flex',
        alignItens: 'center',
        width: '100%'
    }

    return (
        <div className="option-container" style={styleContainer}>
            <div className="text" style={styleText}>
                <div className="index" style={styleIndex}>{index + 1}.</div>
                <InputText
                    id={stateOption?.id + 'name'}
                    value={stateOption?.name}
                    placeholder={'Nome da opção'}
                    onChange={(value) => {
                        const update = { ...stateOption, name: value }
                        onUpdate(update)
                        setStateOption(update)
                    }}
                />
                <InputText
                    id={stateOption?.id + 'wordKeys'}
                    value={stateOption?.value}
                    placeholder={'Valor'}
                    onChange={(value) => {
                        const update = { ...stateOption, value: value }
                        onUpdate(update)
                        setStateOption(update)
                    }}
                />
            </div>
            <div className="buttons">
                {deleteState ?
                    <IconButton onClick={() => { onDelete(stateOption?.id) }} size='small' ><i className='bx bx-trash' ></i></IconButton> :
                    <IconButton size='small' disable={true}><i className='bx bx-trash' ></i></IconButton>
                }
            </div>
        </div>
    )
}
function TypeCondition({ data, updateOptions }) {
    const [options, setOptions] = useState(null)

    useEffect(() => {
        data?.options && console.log(data?.options[0]?.conditions);
    }, [data])
    useEffect(() => {

        if (data && verifyCondition(data.options)) {
            setOptions(data.options)
        } else {
            if (data.options) {
                var idOne = uuidv4()
                var idTwo = uuidv4()
                setOptions([{
                    id: 'conditionId',
                    value: 'Conditions',
                    nextStep: 'conditionNextStep',
                    backStep: 'conditionBackStep',
                    conditions: [
                        { type: 'conditionvalues', operator: '===', valueOne: null, valueTwo: null },
                    ]
                },
                {
                    id: idOne,
                    value: 'Se VERDADEIRO',
                    nextStep: idOne,
                    backStep: data?.options[0]?.backStep
                },
                {
                    id: idTwo,
                    value: 'Se FALSO',
                    nextStep: idTwo,
                    backStep: data?.options[0]?.backStep
                }
                ])

            }
            // setDataOptionsSelect(dataSelect)
        }
    }, [data])
    useEffect(() => {
        updateOptions(options)
    }, [options])

    function verifyCondition(options) {
        if (options) {
            if (
                options[0].hasOwnProperty('conditions') &&
                options[1].hasOwnProperty('nextStep') &&
                options[1].hasOwnProperty('backStep') &&
                options[2].hasOwnProperty('nextStep') &&
                options[2].hasOwnProperty('backStep')
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    return (
        <div className="types-container">
            <div className="message-create">
                <div className="title">Condições</div>

                <div>
                    {options && options[0]?.conditions?.map((condition, index) => {
                        return <ConditionOption
                            onDelete={(index) => {
                                var update = JSON.parse(JSON.stringify(options));
                                update[0].conditions.splice(index, 1); update[0].conditions.splice(index - 1, 1);
                                setOptions(update);
                                updateOptions(update)
                            }}
                            onChange={(data) => {
                                var update = JSON.parse(JSON.stringify(options));
                                update[0].conditions[index] = { ...update[0].conditions[index], ...data };
                                setOptions(update);
                                updateOptions(update)
                            }}
                            key={index + 'condition-option'}
                            index={index}
                            data={condition}
                        />
                    })}
                    <ButtonModel
                        type='circle-secoundary'
                        onClick={() => {
                            var update = JSON.parse(JSON.stringify(options))
                            update[0].conditions.push(...[
                                { type: 'conjunction', operator: '&&' },
                                { type: 'conditionvalues', operator: '===', valueOne: null, valueTwo: null }
                            ])
                            setOptions(update)
                            updateOptions(update)
                        }}
                    >
                        <i className='bx bx-plus'></i> Adicionar Condição
                    </ButtonModel>

                </div>
            </div>
        </div>
    )
}
function ConditionOption({ data, onChange, onDelete, index }) {
    const operators = [

        { name: 'IGUAL A', value: '===', tag: 'and', type: 'operator' },
        { name: 'DIFERENTE DE', value: '!==', tag: 'and', type: 'operator' },
        { name: 'MAIOR QUE', value: '>', tag: 'and', type: 'operator' },
        { name: 'MENOR QUE', value: '<', tag: 'and', type: 'operator' },
        { name: 'MAIOR OU IGUAL A', value: '>=', tag: 'and', type: 'operator' },
        { name: 'MENOR OU IGUAL A', value: '<=', tag: 'and', type: 'operator' },

    ]
    const junctions = [
        { name: 'E', value: '&&', tag: 'and', type: 'operator' },
        { name: 'OU', value: '||', tag: 'and', type: 'operator' },
    ]
    if (data?.type === 'conditionvalues') {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <InputText
                    value={data.valueOne}
                    placeholder={'Valor1'}
                    onChange={(e) => {
                        onChange({ valueOne: e })
                    }}
                />
                <InputSelect
                    style={{ minWidth: '10rem' }}
                    placeholder='Operador'
                    data={operators?.map((operator) => { return { name: operator.name, value: operator.value, selected: data.operator === operator.value } })}
                    onChange={(e) => {
                        onChange({ operator: e })
                    }}
                />
                <InputText
                    value={data.valueTwo}
                    placeholder={'Valor2'}
                    onChange={(e) => {
                        onChange({ valueTwo: e })
                    }}
                />
                {index > 0 ? <IconButton onClick={() => onDelete(index)} size='small'><i className='bx bx-trash' ></i></IconButton> : <IconButton size='small' disable><i className='bx bx-trash' ></i></IconButton>}
            </div>
        )
    }
    if (data?.type === 'conjunction') {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem'
            }}>
                <InputSelect
                    style={{ minWidth: '3rem' }}
                    placeholder='Conjunção'
                    data={junctions?.map((operator) => { return { name: operator.name, value: operator.value, selected: data.operator === operator.value } })}
                    onChange={(value) => {
                        onChange({ operator: value })
                    }}
                />
            </div>
        )
    }

}
function Section(props) {
    const { edges, setEdges, nodes, setNodes } = useContext(AppContext)
    const [messages, setMessages] = useState(null)
    const [isStart, setIsStart] = useState(false)
    const [isEnd, setIsEnd] = useState(false)
    const [dialogBoxDelete, setDialogBoxDelete] = useState(false)
    useEffect(() => {
        // console.log(props);
        if (props.data.sections.find((section) => section.isStart)) setIsStart(true)
        else setIsStart(false)
        if (props.data.sections.find((section) => section.isEnd)) setIsEnd(true)
        else setIsEnd(false)
        setMessages(props.data.sections)
    }, [props])
    function deleteNode() {
        setEdges(edges.filter((edge) => edge.target !== props.id))
        setNodes(nodes.filter((node) => node.id !== props.id))
    }
    return <div key={props?.id + 'section'} className="section" style={{ position: 'relative' }}>
        {/* <div style={{ fontSize: '0.8rem', color: 'yellow' }}>{props?.id || 'null'}</div>  */}
        <DialogBox
            open={dialogBoxDelete}
            text='Deseja excluir este bloco? Todas as mensagens deste bloco também serão excluídas.'
            buttonOneText='Excluir'
            buttonTwoText='Cancelar'
            onButtonTwo={!setDialogBoxDelete}
            onClose={!setDialogBoxDelete}
            onButtonOne={() => {
                deleteNode()
            }}
        />
        {(props?.data.isDeletable || !edges.find((edge) => edge.target === props.id) && !props.data.sections[0].isStart) ? <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <IconButton onClick={() => {
                setDialogBoxDelete(true)
            }}>
                <i className='bx bx-trash'></i>
            </IconButton></div> : null}
        {!isStart ? <Handle id='top' type='target' position={Position.Top} /> : null}
        {!isEnd ? <Handle id='bottom' type='source' position={Position.Bottom} /> : null}

        {
            messages?.map((step) => {
                return <>

                    {typeStep(step)}

                </>
            })
        }

    </div>
}

function typeStep(step) {

    if (step.type === 'inputOptions') {
        return <MessageInputOptions key={step.id + 'message'} data={step} />
    }
    if (step.type === 'simpleMessage') {
        return <MessageSimpleMessage key={step.id + 'message'} data={step} />

    }
    if (step.type === 'input') {
        return <MessageInput key={step.id + 'message'} data={step} />

    }
    if (step.type === 'options') {
        return <MessageOptions key={step.id + 'message'} data={step} />

    }
    if (step.type === 'transfer') {
        return <MessageTransfer key={step.id + 'message'} data={step} />
    }
    if (step.type === 'modelDify') {
        return <MessageModelDify key={step.id + 'message'} data={step} />
    }
    if (step.type === 'transfer') {
        return <MessageTransfer key={step.id + 'message'} data={step} />
    }
    if (step.type === 'sendRequest') {
        return <MessageSendRequest key={step.id + 'message'} data={step} />
    }
    if (step.type === 'survey') {
        return <MessageSurvey key={step.id + 'message'} data={step} />
    }
    if (step.type === 'bookmark') {
        return <MessageBookmark key={step.id + 'message'} data={step} />
    }
    if (step.type === 'removeBookmark') {
        return <MessageRemoveBookmark key={step.id + 'message'} data={step} />
    }
    if (step.type === 'notificationWhatsapp') {
        return <MessageNotificationWhatsapp key={step.id + 'message'} data={step} />
    }
    if (step.type === 'condition') {
        return <MessageCondition key={step.id + 'message'} data={step} />
    }
    if (step.type === 'otherAssistant') {
        return <MessageOtherAssistant key={step.id + 'message'} data={step} />
    }
}

function MessageSimpleMessage({ data }) {
    const { setCreateAreaData } = useContext(AppContext)
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bx-message icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            {data?.message ? <MessageComponent key={data.id + "-messageOne"} message={data.message} exampleMode={true} /> : null}
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>

    </div>
}

function MessageInput({ data }) {
    const { setCreateAreaData } = useContext(AppContext)
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bx-font icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}

            {
                data?.message ?
                    <div>
                        <MessageComponent key={data.id + "-messageOne"} message={data.message} exampleMode={true} />
                        <MessageComponent key={data.id + "-messageTwo"} message={formatClientMessage('Cliente digita ' + data.options[0].name)} exampleMode={true} />
                    </div>
                    :
                    <div className="action-container" style={{ backgroundColor: 'var(--violet-color' }}>
                        <div className="content">
                            <i className='bx bx-font'></i> <div className="text">Ler resposta</div>
                        </div>
                    </div>
            }

            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>
    </div>
}

function MessageTransfer({ data }) {
    const { setCreateAreaData } = useContext(AppContext)
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bx-support icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            <Space></Space>
            <div className="action-container" style={{ backgroundColor: 'var(--danger-color' }}>
                <div className="content">
                    <i className='bx bx-support'></i> <div className="text">Transferir para setor</div>
                </div>
            </div>
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>
    </div>

}
function MessageModelDify({ data }) {
    const { setCreateAreaData } = useContext(AppContext)
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bx-support icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            <Space></Space>
            <div className="action-container" style={{ backgroundColor: 'var(--tree-color' }}>
                <div className="content">
                    <i className='bx bxs-brain'></i> <div className="text">Modelo de I.A.</div>
                </div>
            </div>
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>
    </div>

}
function MessageBookmark({ data }) {
    const { setCreateAreaData } = useContext(AppContext)
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bxs-tag icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            <Space></Space>
            <div className="action-container" style={{ backgroundColor: 'var(--violet-color' }}>
                <div className="content">
                    <i className='bx bxs-tag'></i> <div className="text">Adicionar Marcador</div>
                </div>
            </div>
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>
    </div>

}

function MessageRemoveBookmark({ data }) {
    const { setCreateAreaData } = useContext(AppContext)
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bxs-tag-x icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            <Space></Space>
            <div className="action-container" style={{ backgroundColor: 'var(--orange-color' }}>
                <div className="content">
                    <i className='bx bxs-tag-x'></i> <div className="text">Remover Marcador</div>
                </div>
            </div>
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>
    </div>

}

function MessageNotificationWhatsapp({ data }) {
    const { setCreateAreaData } = useContext(AppContext)
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bxl-whatsapp icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            <Space></Space>
            <div className="action-container" style={{ backgroundColor: 'var(--success-color' }}>
                <div className="content">
                    <i className='bx bxl-whatsapp'></i> <div className="text">Notificação para Whatsapp</div>
                </div>
            </div>
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>
    </div>

}

function MessageCondition({ data }) {
    const { setCreateAreaData } = useContext(AppContext)
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bx-git-repo-forked icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            <Space></Space>
            <div className="action-container" style={{ backgroundColor: 'var(--pink-color' }}>
                <div className="content">
                    <i className='bx bx-git-repo-forked'></i> <div className="text">Condição</div>
                </div>
            </div>
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>
    </div>

}

function MessageOtherAssistant({ data }) {
    const { setCreateAreaData } = useContext(AppContext)
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bx-git-repo-forked icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            <Space></Space>
            <div className="action-container" style={{ backgroundColor: 'var(--danger-color' }}>
                <div className="content">
                    <i className='bx bxs-bot'></i> <div className="text">Transf. para assistente</div>
                </div>
            </div>
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>
    </div>

}


function MessageSendRequest({ data }) {
    const { setCreateAreaData } = useContext(AppContext)
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bx-transfer-alt icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            <Space></Space>
            <div className="action-container" style={{ backgroundColor: 'var(--pink-color' }}>
                <div className="content">
                    <i className='bx bx-send'></i> <div className="text">Enviar Requisição</div>
                </div>
            </div>
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>
    </div>

}

function MessageOptions({ data }) {
    const [dataState, setDataState] = useState(null)
    const { setCreateAreaData } = useContext(AppContext)
    useEffect(() => {
        setDataState(data)
    }, [data])
    function formatMessage(dataStep) {
        let dataStepCopy = JSON.parse(JSON.stringify(dataStep)); // cria uma cópia profunda do objeto
        dataStepCopy.message.text += '\n';
        for (let index = 0; index < dataStepCopy.options.length; index++) {
            dataStepCopy.message.text += `${index + 1} - ${dataStepCopy.options[index].value}\n`;
        }
        dataStepCopy.message.text += `\nDigite #cancelar a qualquer momento para cancelar o seu atendimento.`;
        return dataStepCopy.message
    }

    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bx-list-ul icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            {dataState ? <MessageComponent key={dataState?.id + "-messageOne"} message={formatMessage(dataState)} exampleMode={true} /> : null}
        </div>

    </div>

}

function MessageInputOptions({ data }) {
    const [dataState, setDataState] = useState(null)
    const { setCreateAreaData } = useContext(AppContext)
    useEffect(() => {
        setDataState(data)
    }, [data])
    function formatMessage(dataStep) {
        let dataStepCopy = JSON.parse(JSON.stringify(dataStep)); // cria uma cópia profunda do objeto
        if (dataStepCopy?.message) {
            dataStepCopy.message.text += '\n';
            for (let index = 0; index < dataStepCopy.options.length; index++) {
                dataStepCopy.message.text += `${index + 1} - ${dataStepCopy.options[index].value}\n`;
            }
            dataStepCopy.message.text += `\nDigite #cancelar a qualquer momento para cancelar o seu atendimento.`;
            return dataStepCopy.message
        } else {
            return null
        }
    }

    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bx-list-ol icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            {dataState?.message ? <MessageComponent key={dataState?.id + "-messageOne"} message={formatMessage(dataState)} exampleMode={true} /> : null}
            <MessageComponent key={data.id + "-messageTwo"} message={formatClientMessage('Cliente escolhe uma opção.')} exampleMode={true} />
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>

    </div>

}

function MessageSurvey({ data }) {
    const [dataState, setDataState] = useState(null)
    const { setCreateAreaData } = useContext(AppContext)
    useEffect(() => {
        setDataState(data)
    }, [data])
    function formatMessage(dataStep) {
        let dataStepCopy = JSON.parse(JSON.stringify(dataStep)); // cria uma cópia profunda do objeto

        let options = dataStepCopy?.options[0]?.options
        if (dataStepCopy?.message) {
            dataStepCopy.message.text += '\n';
            for (let index = 0; index < options?.length; index++) {
                dataStepCopy.message.text += `${index + 1} - ${options[index].name}\n`;
            }
            //dataStepCopy.message.text += `\nDigite #cancelar a qualquer momento para cancelar o seu atendimento.`;
            return dataStepCopy.message
        }
        return null
    }
    return <div className='message-section'>
        <SideButtons data={data} />
        <div className='message-section-messages' onClick={() => {
            setCreateAreaData(data)
        }}>
            {data.isStart ?
                <div className="start-conversation">
                    <span><i className='bx bxs-star'></i>Início da conversa</span>
                    <Space>
                        <Bar />
                    </Space>

                </div> :
                null
            }
            <div className="icon-type-message"><i className='bx bx-question-mark icon-type-message-i'></i></div>
            {data.isStart ? <MessageComponent key={data.id + "-messageStart"} message={formatClientMessage('Olá, bom dia!')} exampleMode={true} /> : null}
            {dataState?.message ? <MessageComponent key={dataState?.id + "-messageOne"} message={formatMessage(dataState)} exampleMode={true} /> : null}
            <MessageComponent key={data.id + "-messageTwo"} message={formatClientMessage('Cliente escolhe uma opção.')} exampleMode={true} />
            {data.isEnd ?
                <div className="end-conversation">
                    <Space>
                        <Bar />
                    </Space>
                    <span><i className='bx bxs-check-circle'></i>Fim da conversa</span>
                </div> :
                null
            }
        </div>

    </div>

}
function SideButtons({ data }) {
    const { nodes, edges, setNodes, setEdges, setCreateAreaData } = useContext(AppContext)
    const [dataState, setDataState] = useState(null)
    const [sectionData, setSectionData] = useState(null)
    const [buttonDelete, setButtonDelete] = useState(null)
    useEffect(() => {
        setDataState(data)
        setSectionData(nodes.filter(node => node.id === data.section))
    }, [data, nodes])

    useEffect(() => {
        setSectionData(nodes?.filter(node => node.id === dataState?.section))
    }, [nodes, dataState])
    useEffect(() => {
        if (sectionData) {
            if (sectionData?.length > 0) {
                sectionData[0].data.sections.length > 1 ? setButtonDelete(true) : setButtonDelete(false)
            }

        }
    }, [sectionData])
    return <div className="buttons">
        {
            data.isStart ? null :
                <div>
                    {/* Add Button */}
                    <IconButton
                        key={data.id + 'buttonPlusTop'}
                        type='secoudary-circle'
                        size='super-small'
                        onClick={() => {
                            setSectionData(nodes.filter(node => node.id === dataState.section))
                            var index = nodes.findIndex(section => section.id === dataState.section)
                            if (index >= 0) {
                                var data = JSON.parse(JSON.stringify(nodes))
                                var thisStepIndex = data[index].data.sections.findIndex(step => step.id === dataState.id)
                                data[index].data.sections.push(createStep('simpleMessage', dataState.section, dataState.index))
                                data[index].data.sections = moveArrayElement(data[index].data.sections, data[index].data.sections.length - 1, thisStepIndex)
                                data[index].data.sections = data[index].data.sections.map((step, index) => {
                                    step.index = index + 1
                                    return step
                                })
                                if (data[index].data.sections[thisStepIndex - 1]?.type === 'inputOptions') {
                                    let nextStep = data[index].data.sections[thisStepIndex]?.id
                                    let options = data[index].data.sections[thisStepIndex - 1].options.map((option) => {
                                        option.nextStep = nextStep
                                        return option
                                    })
                                    data[index].data.sections[thisStepIndex - 1].options = options

                                    data[index].data.sections[thisStepIndex].options[0].nextStep = data[index].data.sections[thisStepIndex + 1].id || null
                                    if (data[index].data.sections[thisStepIndex - 1]) {
                                        data[index].data.sections[thisStepIndex].options[0].backStep = data[index].data.sections[thisStepIndex - 1].id || null
                                        data[index].data.sections[thisStepIndex - 1].options[0].nextStep = data[index].data.sections[thisStepIndex].id
                                    }
                                } else if (data[index].data.sections[thisStepIndex + 1]?.type === 'inputOptions') {
                                    let nextStep = data[index].data.sections[thisStepIndex]?.id
                                    let options = data[index].data.sections[thisStepIndex + 1].options.map((option) => {
                                        option.backStep = nextStep
                                        return option
                                    })
                                    data[index].data.sections[thisStepIndex + 1].options = options

                                    data[index].data.sections[thisStepIndex].options[0].nextStep = data[index].data.sections[thisStepIndex + 1].id || null
                                    if (data[index].data.sections[thisStepIndex - 1]) {
                                        data[index].data.sections[thisStepIndex].options[0].backStep = data[index].data.sections[thisStepIndex - 1].id || null
                                        data[index].data.sections[thisStepIndex - 1].options[0].nextStep = data[index].data.sections[thisStepIndex].id
                                    }
                                } else {
                                    //update Next and back step after delete 
                                    if (data[index].data.sections[thisStepIndex + 1]) {
                                        data[index].data.sections[thisStepIndex].options[0].nextStep = data[index].data.sections[thisStepIndex + 1].id || null
                                        data[index].data.sections[thisStepIndex].options[0].backStep = data[index].data.sections[thisStepIndex + 1].options[0].backStep || null
                                        data[index].data.sections[thisStepIndex + 1].options[0].backStep = data[index].data.sections[thisStepIndex].id
                                    }
                                    if (data[index].data.sections[thisStepIndex - 1]) {
                                        data[index].data.sections[thisStepIndex - 1].options[0].nextStep = data[index].data.sections[thisStepIndex].id
                                    }
                                }
                                setNodes(JSON.parse(JSON.stringify(data)))
                            }
                        }}
                    >
                        <i className='bx bx-plus'></i>
                    </IconButton>
                    {/* Delete Button */}
                    {buttonDelete ? <IconButton
                        key={data.id + 'buttonTrash'}
                        type='secoudary-circle'
                        size='super-small'
                        onClick={() => {
                            setSectionData(nodes.filter(node => node.id === dataState.section))
                            var nodesData = JSON.parse(JSON.stringify(nodes))
                            var indexNode = nodesData.findIndex(node => node.id === dataState.section)
                            var indexThisStep = nodesData[indexNode].data.sections.findIndex(step => step.id === dataState.id)
                            if (nodesData[indexNode].data.sections[indexThisStep - 1]) {
                                nodesData[indexNode].data.sections[indexThisStep - 1].options[0].nextStep = nodesData[indexNode].data.sections[indexThisStep].options[0].nextStep || null
                            }
                            if (nodesData[indexNode].data.sections[indexThisStep + 1]) {
                                nodesData[indexNode].data.sections[indexThisStep + 1].options[0].backStep = nodesData[indexNode].data.sections[indexThisStep].options[0].backStep || null
                            }
                            var dataFiltered = nodesData.map((node) => {
                                node.data.sections = node.data.sections.filter(step => step.id !== dataState.id)
                                node.data.sections = node.data.sections.map((step, index) => {
                                    step.index = index + 1
                                    return step
                                })
                                return node
                            })
                            if (dataState.type === 'inputOptions') {
                                //step that will take the place of the excluded => nodesData[indexNode].data.sections[indexStep]
                                //before step => nodesData[indexNode].data.sections[indexStep -1]
                                if (['inputOptions', 'options'].includes(nodesData[indexNode].data.sections[indexThisStep].type)) {
                                    let backStep = nodesData[indexNode].data.sections[indexThisStep - 1]?.id
                                    let options = nodesData[indexNode].data.sections[indexThisStep].options.map((option) => {
                                        option.backStep = backStep
                                        return option
                                    })
                                    nodesData[indexNode].data.sections[indexThisStep].options = options
                                } else {
                                    if (nodesData[indexNode].data.sections[indexThisStep - 1]) {
                                        nodesData[indexNode].data.sections[indexThisStep - 1].options[0].backStep = nodesData[indexNode].data.sections[indexThisStep].id
                                    }

                                }
                            }
                            if (dataState.type === 'options') {
                                const indexData = dataFiltered.findIndex(node => node.id === dataState.section)
                                const sectionsChildrens = dataFiltered[indexData].data.children
                                dataFiltered = dataFiltered.filter(node => !sectionsChildrens.includes(node.id))
                            }
                            if (dataState.type === 'options') {
                                var result = deleteNodes(dataState.options.map(option => option.id), dataFiltered, edges)
                                setNodes(result.nodes)
                                setEdges(result.edges)
                            } else {
                                setNodes(dataFiltered)
                            }

                        }}
                    >
                        <i className='bx bx-trash'></i>
                    </IconButton> : null}
                </div>}
        {/* Edit Button */}
        <IconButton
            key={data.id + 'buttonPencil'}
            type='secoudary-circle'
            size='super-small'
            onClick={() => {
                setSectionData(nodes?.filter(node => node.id === dataState.section))
                setCreateAreaData(data)
            }}
        >
            <i className='bx bx-pencil' ></i>
        </IconButton>
        {/* Add Button */}
        {data.isEnd || data.type === 'options' ?
            null :
            <IconButton
                key={data.id + 'buttonPlusBottom'}
                type='secoudary-circle'
                size='super-small'
                onClick={() => {
                    console.log('dataState', dataState);
                    setSectionData(nodes.filter(node => node.id === dataState.section))
                    var index = nodes.findIndex(section => section.id === dataState.section)
                    console.log('index', index);
                    if (index >= 0) {
                        var data = JSON.parse(JSON.stringify(nodes))
                        var thisStepIndex = data[index].data.sections.findIndex(step => step.id === dataState.id)
                        data[index].data.sections.push(createStep('simpleMessage', dataState.section, dataState.index))
                        if (data[index].data.sections.length - 1 !== thisStepIndex) {
                            thisStepIndex++
                            data[index].data.sections = moveArrayElement(data[index].data.sections, data[index].data.sections.length - 1, thisStepIndex)
                        }
                        data[index].data.sections = data[index].data.sections.map((step, index) => {
                            step.index = index + 1
                            return step
                        })
                        if (data[index].data.sections[thisStepIndex - 1]?.type === 'inputOptions') {
                            let thisStep = data[index].data.sections[thisStepIndex]?.id
                            let options = data[index].data.sections[thisStepIndex - 1].options.map((option) => {
                                option.nextStep = thisStep
                                return option
                            })
                            data[index].data.sections[thisStepIndex - 1].options = options
                            data[index].data.sections[thisStepIndex].options[0].nextStep = data[index].data.sections[thisStepIndex + 1]?.id || null
                            data[index].data.sections[thisStepIndex].options[0].backStep = data[index].data.sections[thisStepIndex - 1]?.id || null
                        } else if (data[index].data.sections[thisStepIndex + 1]?.type === 'inputOptions') {
                            let thisStep = data[index].data.sections[thisStepIndex]?.id
                            let options = data[index].data.sections[thisStepIndex + 1].options.map((option) => {
                                option.backStep = thisStep
                                return option
                            })
                            data[index].data.sections[thisStepIndex + 1].options = options
                            data[index].data.sections[thisStepIndex].options[0].nextStep = data[index].data.sections[thisStepIndex + 1]?.id || null
                            data[index].data.sections[thisStepIndex].options[0].backStep = data[index].data.sections[thisStepIndex - 1]?.id || null
                        } else {
                            if (data[index].data.sections[thisStepIndex - 1]) {
                                data[index].data.sections[thisStepIndex].options[0].nextStep = data[index].data.sections[thisStepIndex - 1].options[0].nextStep || null
                                data[index].data.sections[thisStepIndex].options[0].backStep = data[index].data.sections[thisStepIndex - 1].id || null
                                data[index].data.sections[thisStepIndex - 1].options[0].nextStep = data[index].data.sections[thisStepIndex].id
                            }
                            if (data[index].data.sections[thisStepIndex + 1]) {
                                data[index].data.sections[thisStepIndex + 1].options[0].backStep = data[index].data.sections[thisStepIndex].id
                            }

                        }
                        setNodes(JSON.parse(JSON.stringify(data)))
                    }
                }}
            >
                <i className='bx bx-plus'></i>
            </IconButton>
        }
    </div >
}

function formatClientMessage(text) {
    return {
        idConversation: null,
        controlId: null,
        fromApp: null,

        msg: true,
        type: {
            typeMessage: 'text',
            toShow: true
        },
        response: null,
        from: {
            client: 'client',
            name: 'client',
            connection: null,
        },
        to: "id",
        file: null,
        text: text,
        read: true,
        hour: '00:00',
        date: 'kjkjkjk'
    }
}

function moveArrayElement(arr, from, to) {
    var el = arr[from];
    arr.splice(from, 1);
    arr.splice(to, 0, el);
    return arr
};

function deleteNodes(nodesIds, dataNodes, edges) {
    dataNodes = dataNodes.filter(node => !nodesIds.includes(node.id) && !checkIfContains(node.data.parent, nodesIds))
    edges = deleteEdges(edges, dataNodes)
    return { nodes: dataNodes, edges: edges }
}

function deleteEdges(edges, nodes) {
    var result = edges.filter(edge => {
        var index = nodes.findIndex(node => node.id === edge.target)
        return index >= 0
    })
    return result
}

function createSection(assistantId, id, positionX, positionY, parent, children) {
    var idSection = uuidv4()
    var section = {
        id: id || idSection,
        type: 'section',
        data: {
            assistantId: assistantId || null,
            children: children || [],
            parent: parent || [],
            sections: [createStep('simpleMessage', id || idSection, 1)]
        },
        position: { x: positionX || 0, y: positionY || 0 },
    }
    return section
}
function createNewSection({ assistantId, positionX, positionY }) {
    var idSection = uuidv4()
    var section = {
        id: idSection,
        type: 'section',
        data: {
            isDeletable: true,
            assistantId: assistantId || null,
            children: [],
            parent: [],
            sections: [createStep('simpleMessage', idSection, 1)]
        },
        position: { x: positionX, y: positionY },
    }
    return section
}
function createStep(type, section, index) {
    var step = {
        id: uuidv4(),
        type: type,
        section: section,
        index: index,
        isStart: false,
        isEnd: false,
        message: createMessage(),
        negativeMessage: createMessage('Por favor, digite apenas a opção desejada.'),
        options: [{
            nextStep: null,
            backStep: null,
        }]

    }

    return step
}

function createMessage(text, file) {
    return {
        idConversation: null,
        controlId: null,
        fromApp: null,
        msg: true,
        type: {
            typeMessage: 'text',
            toShow: false
        },
        response: null,
        from: {
            client: 'catbot',
            name: 'catbot',
            connection: null,
        },
        to: null,
        file: file || null,
        text: text || 'Sua mensagem aparece aqui.',
        read: true,
        hour: '00:00',
        date: '00/00/00'
    }
}
function createEdge(assistantId, source, target, labelValue, prefixLabel) {
    var edge = {
        assistantId: assistantId || null,
        id: uuidv4(),
        type: 'smoothstep',
        source: source,
        target: target,
        animated: true,
        label: prefixLabel || '' + labelValue,
        style: { stroke: 'gray' },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#d0d0d0', color: '#0000', fillOpacity: 1 },
        markerEnd: {
            type: MarkerType.ArrowClosed,
        }
    }
    return edge
}

function createEdgeSwipe(assistantId, edgeObject) {
    var edge = {
        assistantId: assistantId || null,
        id: uuidv4(),
        animated: true,
        type: "smoothstep",
        style: { stroke: 'gray' },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#d0d0d0', color: '#0000', fillOpacity: 1 },
        markerEnd: {
            type: MarkerType.ArrowClosed,
        }
    }
    return { ...edge, ...edgeObject }
}
function checkIfContains(array1, array2) {
    return array1.some(value => array2.includes(value));
}
