const comprasController = require('../app/controllers/ComprasController')
const Compra = require("../app/models/compra") 
const LoadComprasService = require('../app/services/LoadComprasService') // Serviço para carregar compras


describe("Create Purchase cases", () => {
    it("Should render the create page", async () => {
        const mockRender = jest.fn();
        
        await comprasController.create(
            {}, // Requisição vazia, pois não há necessidade de parâmetros
            {
                render: mockRender
            }
        );

        expect(mockRender).toHaveBeenCalledWith("Admin/compras/create");
    });

    it("Should return a message if any field is empty", async () => {
        const mockSend = jest.fn();
        
        await comprasController.post(
            {
                body: {
                    field1: "", // Campo obrigatório vazio
                    field2: "value"
                }
            },
            {
                send: mockSend
            }
        );

        expect(mockSend).toHaveBeenCalledWith("Por favor preencha todos os campos!");
    });

    it("Should create a new purchase and redirect if all fields are filled", async () => {
        const mockRedirect = jest.fn();
        
        // Mockando Compra.create para simular a criação da compra
        jest.spyOn(Compra, 'create').mockResolvedValue({ id: 1 });

        await comprasController.post(
            {
                body: {
                    field1: "value1",
                    field2: "value2"
                }
            },
            {
                redirect: mockRedirect
            }
        );

        expect(mockRedirect).toHaveBeenCalledWith("/admin/compras/");
    });
});

describe("Edit Purchase cases", () => {
    it("Should return a message if any required field is empty", async () => {
        const mockSend = jest.fn();
        
        await comprasController.put(
            {
                body: {
                    compra_id: "", // Campo obrigatório vazio
                    client_id: "value",
                    bilhete_id: "file1",
                    amount: "photo1",
                    status: ""
                }
            },
            {
                send: mockSend
            }
        );

        expect(mockSend).toHaveBeenCalledWith("Por favor, preencha todos os campos!");
    });

     it("Should update a compra and redirect if all fields are filled", async () => {
        const mockRedirect = jest.fn();
        
        // Mockando Compra.update para simular a atualização da compra
        jest.spyOn(Compra, 'update').mockResolvedValue();

        await comprasController.put(
            {
                body: {
                    id: 1,
                    field1: "value1",
                    field2: "value2"
                }
            },
            {
                redirect: mockRedirect
            }
        );

        expect(mockRedirect).toHaveBeenCalledWith("/admin/compras/1");
    });

    it("Should return a message if the compra is not found", async () => {
        const mockSend = jest.fn();
        
        // Mockando LoadComprasService.load para retornar null
        jest.spyOn(LoadComprasService, 'load').mockResolvedValue(null);

        await comprasController.compra_admin_edit(
            {
                params: { id: 1 }
            },
            {
                send: mockSend
            }
        );

        expect(mockSend).toHaveBeenCalledWith("Compra não encontrada");
    });

    it("Should render the edit page with compra data when compra is found", async () => {
        const mockRender = jest.fn();
        
        // Mockando LoadComprasService.load para retornar uma compra válida
        jest.spyOn(LoadComprasService, 'load').mockResolvedValue({
            id: 1,
            name: 'Compra Example'
        });

        await comprasController.compra_admin_edit(
            {
                params: { id: 1 }
            },
            {
                render: mockRender
            }
        );

        expect(mockRender).toHaveBeenCalledWith("Admin/compras/edit", {
            compra: {
                id: 1,
                name: 'Compra Example'
            }
        });
    });
});

describe("Get Purchase cases", () => {
    it("Should render the index page with compras when loading is successful", async () => {
        const mockRender = jest.fn();
        
        // Mockando LoadComprasService.load para retornar uma lista de compras
        jest.spyOn(LoadComprasService, 'load').mockResolvedValue([
            { id: 1, name: 'Compra 1' },
            { id: 2, name: 'Compra 2' }
        ]);

        await comprasController.index(
            {}, // Requisição vazia, pois não há parâmetros necessários
            {
                render: mockRender
            }
        );

        expect(mockRender).toHaveBeenCalledWith("Admin/compras/index", {
            compras: [
                { id: 1, name: 'Compra 1' },
                { id: 2, name: 'Compra 2' }
            ]
        });
    });

    it("Should handle error when loading compras fails", async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Mockando LoadComprasService.load para lançar um erro
        jest.spyOn(LoadComprasService, 'load').mockRejectedValue(new Error("Erro ao carregar compras"));

        const mockRender = jest.fn();
        
        await comprasController.index(
            {}, // Requisição vazia
            {
                render: mockRender
            }
        );

        // Verifica se console.error foi chamado com o erro
        expect(consoleError).toHaveBeenCalledWith(expect.any(Error));
        
        //testa se render não foi chamado
        expect(mockRender).not.toHaveBeenCalled();

        consoleError.mockRestore(); // Restaurar console.error
    });
});

describe("Delete Purchase cases", () => {
    it("Should delete a compra and redirect to the index page", async () => {
        const mockRedirect = jest.fn();
        
        // Mockando Compra.delete para simular a exclusão da compra
        jest.spyOn(Compra, 'delete').mockResolvedValue();

        await comprasController.delete(
            {
                body: { id: 1 }
            },
            {
                redirect: mockRedirect
            }
        );

        expect(mockRedirect).toHaveBeenCalledWith("/admin/compras");
    });
});
