import {
    RESPONSE_CODES_CATALOG,
    RESPONSE_MESSAGE_CATALOG,
  } from '../cataloga/response.catalogs';
  
  export class WsResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
    total?: number;
  
    constructor(statusCode: number, message: string, data?: T, total?: number) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.total = total;
    }
  
    static buildOkResponse<J>(data: J) {
      return new WsResponse<J>(
        RESPONSE_CODES_CATALOG.OK,
        RESPONSE_MESSAGE_CATALOG.OK,
        data,
      );
    }
  
    static buildOkListResponse<J>(data: J, total: number) {
      return new WsResponse<J>(
        RESPONSE_CODES_CATALOG.OK,
        RESPONSE_MESSAGE_CATALOG.OK,
        data,
        total,
      );
    }
  
    static buildCreatedResponse<J>(data: J) {
      return new WsResponse<J>(
        RESPONSE_CODES_CATALOG.CREATED,
        RESPONSE_MESSAGE_CATALOG.CREATED,
        data,
      );
    }
  
    static buildBadRequestResponse<J>(data: J) {
      return new WsResponse<J>(
        RESPONSE_CODES_CATALOG.BAD_REQUEST,
        RESPONSE_MESSAGE_CATALOG.BAD_REQUEST,
        data,
      );
    }
  
    static buildNotFoundResponse<J>(data: J) {
      return new WsResponse<J>(
        RESPONSE_CODES_CATALOG.NOT_FOUND,
        RESPONSE_MESSAGE_CATALOG.NOT_FOUND,
        data,
      );
    }
  
    static buildUnauthorizedResponse<J>() {
      return new WsResponse<J>(
        RESPONSE_CODES_CATALOG.UNAUTHORIZED,
        RESPONSE_MESSAGE_CATALOG.UNAUTHORIZED,
        undefined,
      );
    }
  
    static buildErrorResponse<J>(statusCode: number, message: string, data: J) {
      return new WsResponse<J>(
        statusCode ?? RESPONSE_CODES_CATALOG.ERROR,
        message ?? RESPONSE_MESSAGE_CATALOG.ERROR,
        data,
      );
    }

    static buildConflictResponse<J>(message: string) {
      return new WsResponse<J>(
        RESPONSE_CODES_CATALOG.CONFLICT,
        message ?? RESPONSE_MESSAGE_CATALOG.CONFLICT,
        undefined,
      );
    }

    static buildBadCredentialsResponse<J>() {
      return new WsResponse<J>(
        RESPONSE_CODES_CATALOG.UNAUTHORIZED,
        RESPONSE_MESSAGE_CATALOG.BAD_CREDENTIALS,
        undefined,
      );
    }

    static buildBadPasswordResponse<J>() {
      return new WsResponse<J>(
        RESPONSE_CODES_CATALOG.UNAUTHORIZED,
        RESPONSE_MESSAGE_CATALOG.BAD_PASSWORD,
        undefined,
      );
    }
  }
  