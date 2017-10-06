class Api::QuotesController < ApplicationController
  skip_before_action :verify_authenticity_token

  
  def show
    @quote = Quote.find(params[:id])
  end

  def create
    quote = Quote.create(quote_params)
    quote.save
      if quote.save
        render json: quote
      else
        render json: {errors: quote.errors.full_messages}
      end
    end

  private
    def quote_params
      params.require(:quote).permit(:text, :author)
    end
end
