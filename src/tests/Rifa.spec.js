const rifasController = require('../app/controllers/RifasController')
const LoadRifaService = require('../app/services/LoadRecipeService'); 
const Rifa = require("../app/models/rifa");

describe("Create Raffle cases", () => {
    it("1 - Should call function to render create raffle page", async () => {
    // Mock para res.render
    const mockRender = jest.fn();
    
    // Chamando a função create com o mock de res
    await rifasController.create(
        { 
            session: { userId: 'userId'},
            body: {
                name: 'User Lastname',
                numeroBilhetes: 100
            },
            files: ['image1']
        },
        {
            render: mockRender  // Usando o mock render no lugar de send
        }
    );

    // Verificando se res.render foi chamado com o argumento correto
    expect(mockRender).toHaveBeenCalledWith("Admin/rifas/create");
    });

    it("2 - Should return a message if any field is empty", async () => {
        const mockSend = jest.fn();

        await rifasController.post(
            { 
                session: { userId: 'userId' },
                body: {
                    name: 'User Lastname',
                    numeroBilhetes: '' // Simulando um campo vazio
                },
                files: ['image1']
            },
            {
                send: mockSend
            }
        );

        expect(mockSend).toHaveBeenCalledWith("Porfavor preencha todos os campos!");
     })
    
    it("3 - Should return a message if no image is uploaded", async () => {
        const mockSend = jest.fn();

        await rifasController.post(
            { 
                session: { userId: 'userId' },
                body: {
                    name: 'User Lastname',
                    numeroBilhetes: 100
                },
                files: [] // Simulando ausência de imagens
            },
            {
                send: mockSend
            }
        );

        // Verificando se o send foi chamado com a mensagem correta
        expect(mockSend).toHaveBeenCalledWith("Porfavor pelo menos uma imagem!");
    });
})

describe("Update Raffle cases", () => {
    it("4 - Should return a 400 status if any required field is empty", async () => {
        const mockSend = jest.fn();
        const mockStatus = jest.fn(() => ({ send: mockSend }));

        await rifasController.put(
            {
                session: { userId: 'userId' },
                body: {
                    id: 1,
                    name: '', // Campo obrigatório vazio
                    numeroBilhetes: 100,
                    removed_files: ''
                },
                files: []
            },
            {
                status: mockStatus
            }
        );

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockSend).toHaveBeenCalledWith("Por favor, preencha todos os campos");
    });

    it("5 - Should return a 404 status if rifa is not found", async () => {
        const mockSend = jest.fn();
        const mockStatus = jest.fn(() => ({ send: mockSend }));

        // Mockando LoadRifaService.load para retornar null
        jest.spyOn(LoadRifaService, 'load').mockResolvedValue(null);

        await rifasController.rifa_admin_edit(
            {
                params: { id: 1 }
            },
            {
                status: mockStatus
            }
        );

        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockSend).toHaveBeenCalledWith("Rifa não encontrada");
    });

    it("6 - Should render the edit page with rifa data when rifa is found", async () => {
        const mockRender = jest.fn();
        
        // Mockando LoadRifaService.load para retornar uma rifa válida
        jest.spyOn(LoadRifaService, 'load').mockResolvedValue({
            files: [{ filename: 'file1.jpg' }],
            // Adicione outras propriedades da rifa conforme necessário
        });

        await rifasController.rifa_admin_edit(
            {
                params: { id: 1 }
            },
            {
                render: mockRender
            }
        );

        expect(mockRender).toHaveBeenCalledWith("Admin/rifas/edit", {
            rifa: expect.any(Object),
            files: [{ filename: 'file1.jpg' }]
        });
    });

    it("7 - Should return a 500 status on error", async () => {
        const mockSend = jest.fn();
        const mockStatus = jest.fn(() => ({ send: mockSend }));
        
        // Mockando LoadRifaService.load para lançar um erro
        jest.spyOn(LoadRifaService, 'load').mockRejectedValue(new Error("Erro ao carregar"));

        await rifasController.rifa_admin_edit(
            {
                params: { id: 1 }
            },
            {
                status: mockStatus
            }
        );

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockSend).toHaveBeenCalledWith("Erro ao carregar rifa para edição.");
    }); 
})

describe("Delete Raffle cases", () => {
    it("8 - Should redirect to /admin/rifas after successful deletion", async () => {
        const mockRedirect = jest.fn();
        const mockStatus = jest.fn(() => ({ send: jest.fn() }));
        
        // Mockando Rifa.delete para simular sucesso na exclusão
        jest.spyOn(Rifa, 'delete').mockResolvedValue();

        await rifasController.delete(
            {
                body: { id: 1 }
            },
            {
                redirect: mockRedirect,
                status: mockStatus
            }
        );

        expect(mockRedirect).toHaveBeenCalledWith("/admin/rifas");
    });

    it("9 - Should return a 500 status on error during deletion", async () => {
        const mockSend = jest.fn();
        const mockStatus = jest.fn(() => ({ send: mockSend }));
        
        // Mockando Rifa.delete para lançar um erro
        jest.spyOn(Rifa, 'delete').mockRejectedValue(new Error("Erro ao excluir"));

        await rifasController.delete(
            {
                body: { id: 1 }
            },
            {
                status: mockStatus
            }
        );

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockSend).toHaveBeenCalledWith("Erro ao excluir a rifa.");
    });
});


describe("Get Raffle cases", () => {
    it("Should render rifas page with all rifas if user is an admin", async () => {
        const mockRender = jest.fn();
        const mockStatus = jest.fn(() => ({ send: jest.fn() }));
        
        // Mockando LoadRifaService.load para retornar uma lista de rifas
        jest.spyOn(LoadRifaService, 'load').mockResolvedValue([
            { id: 1, name: 'Rifa 1' },
            { id: 2, name: 'Rifa 2' }
        ]);

        await rifasController.index(
            {
                session: { isAdmin: true }
            },
            {
                render: mockRender,
                status: mockStatus
            }
        );

        expect(mockRender).toHaveBeenCalledWith("Admin/rifas/index", {
            rifas: [
                { id: 1, name: 'Rifa 1' },
                { id: 2, name: 'Rifa 2' }
            ],
            isAdmin: true
        });
    });

    it("Should render rifas page with filtered rifas if user is not an admin", async () => {
        const mockRender = jest.fn();
        const mockStatus = jest.fn(() => ({ send: jest.fn() }));
        
        // Mockando LoadRifaService.load para retornar uma lista filtrada de rifas
        jest.spyOn(LoadRifaService, 'load').mockResolvedValue([
            { id: 1, name: 'Rifa 1', client_id: 'userId' }
        ]);

        await rifasController.index(
            {
                session: { isAdmin: false, userId: 'userId' }
            },
            {
                render: mockRender,
                status: mockStatus
            }
        );

        expect(mockRender).toHaveBeenCalledWith("Admin/rifas/index", {
            rifas: [
                { id: 1, name: 'Rifa 1', client_id: 'userId' }
            ],
            isAdmin: false
        });
    });

    it("Should return a 500 status on error", async () => {
        const mockSend = jest.fn();
        const mockStatus = jest.fn(() => ({ send: mockSend }));
        
        // Simulando erro no LoadRifaService.load
        jest.spyOn(LoadRifaService, 'load').mockRejectedValue(new Error("Erro ao carregar"));

        await rifasController.index(
            {
                session: { isAdmin: true }
            },
            {
                status: mockStatus
            }
        );

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockSend).toHaveBeenCalledWith("Erro ao carregar rifas.");
    });
});

