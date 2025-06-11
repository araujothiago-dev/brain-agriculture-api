import { ApiProperty } from "@nestjs/swagger";

export class ResponseGeneric<T> {
    @ApiProperty()
    data: T | null;
    @ApiProperty()
    message: string;
    @ApiProperty()
    error: string | null;
    constructor(data: T | null = null, message: string = "Ação realizada com sucesso.", error: string | null = null) {
        this.data = data;
        this.message = message;
        this.error = error;
    }
}